import sqlite3

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer


# =============================================================================
# CONFIGURATION
# =============================================================================

DB_PATH = "/Users/emmanueldelache/Downloads/Git-Projet-ST4/centrale-ei-web/backend/database.sqlite3"

# Item similarity weights
ALPHA = 0.6  # Collaborative filtering
BETA = 0.4   # Genre similarity

# Final recommendation weights
GAMMA = 0.65  # User-based prediction
DELTA = 0.45  # Item-based prediction

# How many recommendations to generate per user
TOP_K = 25


# =============================================================================
# DATA LOADING
# =============================================================================

def load_data(db_path):
    conn = sqlite3.connect(db_path)

    users_df = pd.read_sql_query("SELECT * FROM User", conn)
    movies_df = pd.read_sql_query("SELECT * FROM Movie", conn)
    ratings_df = pd.read_sql_query("SELECT * FROM Rating", conn)
    movies_genres_df = pd.read_sql_query(
        "SELECT * FROM Movie_Genres_Genre", conn)
    genres_df = pd.read_sql_query("SELECT * FROM Genre", conn)

    conn.close()

    return (
        users_df,
        movies_df,
        ratings_df,
        movies_genres_df,
        genres_df,
    )


# =============================================================================
# SIMILARITY MATRICES
# =============================================================================

def _pick_col(df, candidates):
    for c in candidates:
        if c in df.columns:
            return c
    return None

def build_user_movie_matrix(ratings_df):
    return ratings_df.pivot(
        index="user_id",
        columns="movie_id",
        values="rating_value"
    ).fillna(0)


def build_user_similarity(user_movie_matrix):
    similarity = cosine_similarity(user_movie_matrix)

    np.fill_diagonal(similarity, 0)

    return pd.DataFrame(
        similarity,
        index=user_movie_matrix.index,
        columns=user_movie_matrix.index
    )


def build_movie_similarity(user_movie_matrix):
    similarity = cosine_similarity(user_movie_matrix.T)

    np.fill_diagonal(similarity, 0)

    return pd.DataFrame(
        similarity,
        index=user_movie_matrix.columns,
        columns=user_movie_matrix.columns
    )


def build_genre_similarity(
    movies_df,
    movies_genres_df,
    genres_df
):
    # pick actual column names present in your dataframes
    movie_col = _pick_col(movies_df, ["movie_id", "movieId", "id"])
    mg_movie_col = _pick_col(movies_genres_df, ["movie_id", "movieId", "movieId_id", "movieId"])
    mg_genre_col = _pick_col(movies_genres_df, ["genre_id", "genreId", "genreId_id", "genreId"])
    genre_id_col = _pick_col(genres_df, ["id", "genre_id", "genreId"])
    genre_name_col = _pick_col(genres_df, ["name", "title", "genre"])

    # safe merge: use discovered column names
    if mg_movie_col is None or mg_genre_col is None:
        # fallback: try common names
        mg_movie_col = mg_movie_col or movies_genres_df.columns[0]
        mg_genre_col = mg_genre_col or movies_genres_df.columns[1]

    if genre_id_col and genre_name_col and genre_id_col in genres_df.columns:
        movie_genre_merged = movies_genres_df.merge(
            genres_df[[genre_id_col, genre_name_col]],
            left_on=mg_genre_col,
            right_on=genre_id_col,
            how="left"
        )
        genre_key = genre_name_col
    else:
        movie_genre_merged = movies_genres_df.copy()
        genre_key = mg_genre_col

    # group by movie id key (use mg_movie_col)
    movie_genre_list = (
        movie_genre_merged
        .groupby(mg_movie_col)[genre_key]
        .apply(list)
    )

    # reindex to include all movies (use movie_col from movies_df)
    movie_index = movie_col or movies_df.columns[0]
    movie_genre_list = (
        movie_genre_list
        .reindex(movies_df[movie_index])
        .apply(lambda x: x if isinstance(x, list) else [])
    )

    mlb = MultiLabelBinarizer()

    genre_matrix = mlb.fit_transform(movie_genre_list)

    genre_df = pd.DataFrame(
        genre_matrix,
        index=movies_df[movie_index],
        columns=mlb.classes_
    )

    similarity = cosine_similarity(genre_df)

    np.fill_diagonal(similarity, 0)

    return pd.DataFrame(
        similarity,
        index=genre_df.index,
        columns=genre_df.index
    )


def build_final_movie_similarity(
    movie_similarity_df,
    genre_similarity_df
):
    return (
        ALPHA * movie_similarity_df +
        BETA * genre_similarity_df
    )


# =============================================================================
# PREDICTION
# =============================================================================

def predict_user_based(
    user_id,
    user_movie_matrix,
    user_similarity_df
):
    sim_users = user_similarity_df[user_id].drop(user_id)

    top_users = (
        sim_users
        .sort_values(ascending=False)
        .head(20)
    )

    ratings = user_movie_matrix.loc[top_users.index]

    scores = top_users.values @ ratings
    norm = np.sum(np.abs(top_users.values))

    return pd.Series(
        scores / (norm + 1e-8),
        index=user_movie_matrix.columns
    )


def predict_item_based(
    user_id,
    user_movie_matrix,
    final_movie_similarity
):
    user_ratings = user_movie_matrix.loc[user_id]

    rated_items = user_ratings[user_ratings != 0]

    scores = {}

    for movie_id in final_movie_similarity.index:
        sim_vector = final_movie_similarity.loc[
            movie_id,
            rated_items.index
        ]

        numerator = np.sum(
            sim_vector.values * rated_items.values
        )

        denominator = (
            np.sum(np.abs(sim_vector.values))
            + 1e-8
        )

        scores[movie_id] = numerator / denominator

    return pd.Series(scores)


# =============================================================================
# RECOMMENDATION GENERATION
# =============================================================================

def build_recommendations_for_user(
    user_id,
    user_movie_matrix,
    user_similarity_df,
    final_movie_similarity
):
    user_scores = predict_user_based(
        user_id,
        user_movie_matrix,
        user_similarity_df
    )

    item_scores = predict_item_based(
        user_id,
        user_movie_matrix,
        final_movie_similarity
    )

    user_scores = user_scores.fillna(0)
    item_scores = item_scores.fillna(0)

    final_scores = (
        GAMMA * user_scores +
        DELTA * item_scores
    )

    seen_movies = user_movie_matrix.loc[user_id]
    seen_movies = seen_movies[seen_movies != 0].index

    final_scores = final_scores.drop(
        seen_movies,
        errors="ignore"
    )

    final_scores = final_scores.sort_values(
        ascending=False
    )

    recommendations_df = final_scores.reset_index()
    recommendations_df.columns = ["movie_id", "score"]

    recommendations_df["user_id"] = user_id
    recommendations_df["ranking"] = range(
        1,
        len(recommendations_df) + 1
    )
    recommendations_df = recommendations_df.head(TOP_K).reset_index(drop=True)
    recommendations_df["ranking"] = range(1, len(recommendations_df) + 1)

    return recommendations_df


def build_all_recommendations(
    user_movie_matrix,
    user_similarity_df,
    final_movie_similarity
):
    all_recommendations = []

    for user_id in user_movie_matrix.index:
        recommendations = build_recommendations_for_user(
            user_id,
            user_movie_matrix,
            user_similarity_df,
            final_movie_similarity
        )

        all_recommendations.append(recommendations)

    return pd.concat(all_recommendations)


# =============================================================================
# DATABASE WRITE
# =============================================================================

def write_recommendations_to_db(
    recommendations_df,
    db_path
):
    recommendations_df = recommendations_df.copy()

    recommendations_df = recommendations_df[
        ["user_id", "movie_id", "score", "ranking"]
    ]

    recommendations_df["user_id"] = (
        recommendations_df["user_id"].astype(int)
    )

    recommendations_df["movie_id"] = (
        recommendations_df["movie_id"].astype(int)
    )

    recommendations_df["ranking"] = (
        recommendations_df["ranking"].astype(int)
    )

    recommendation_tuples = list(
        recommendations_df.itertuples(
            index=False,
            name=None
        )
    )

    conn = sqlite3.connect(db_path)
    try:
        cur = conn.cursor()
        # start a transaction, delete existing rows (keeps table schema)
        cur.execute("BEGIN")
        cur.execute("DELETE FROM Recommandation")
        if recommendation_tuples:
            cur.executemany(
                """
                INSERT OR REPLACE INTO Recommandation
                (user_id, movie_id, score, ranking)
                VALUES (?, ?, ?, ?)
                """,
                recommendation_tuples
            )
        conn.commit()
    finally:
        conn.close()


# =============================================================================
# MAIN
# =============================================================================

def main():
    (
        users_df,
        movies_df,
        ratings_df,
        movies_genres_df,
        genres_df,
    ) = load_data(DB_PATH)

    user_movie_matrix = build_user_movie_matrix(
        ratings_df
    )

    user_similarity_df = build_user_similarity(
        user_movie_matrix
    )

    movie_similarity_df = build_movie_similarity(
        user_movie_matrix
    )

    genre_similarity_df = build_genre_similarity(
        movies_df,
        movies_genres_df,
        genres_df
    )

    final_movie_similarity = build_final_movie_similarity(
        movie_similarity_df,
        genre_similarity_df
    )

    recommendations_df = build_all_recommendations(
        user_movie_matrix,
        user_similarity_df,
        final_movie_similarity
    )

    write_recommendations_to_db(
        recommendations_df,
        DB_PATH
    )


if __name__ == "__main__":
    main()
