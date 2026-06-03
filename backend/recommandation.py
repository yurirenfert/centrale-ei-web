import sqlite3
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
import numpy as np

# Connect to the SQLite database
# Replace with the actual path to your SQLite database
db_path = "/Users/emmanueldelache/Downloads/Git-Projet-ST4/centrale-ei-web/backend/database.sqlite3"
conn = sqlite3.connect(db_path)

# Query the User table
user_query = "SELECT * FROM User"
users_df = pd.read_sql_query(user_query, conn)

# Query the Movie table
movie_query = "SELECT * FROM Movie"
movies_df = pd.read_sql_query(movie_query, conn)

# Query the Rating table
rating_query = "SELECT * FROM Rating"
ratings_df = pd.read_sql_query(rating_query, conn)

# Query the Movie-Genre table
movie_genre_query = "SELECT * FROM Movie_Genres_Genre"
movies_genres_df = pd.read_sql_query(movie_genre_query, conn)

# Query the Genre table
genre_query = "SELECT * FROM Genre"
genres_df = pd.read_sql_query(genre_query, conn)

# Close the database connection
conn.close()


user_movie_matrix = ratings_df.pivot(
    index='userId', columns='movieId', values='rating').fillna(0)
user_similarity = cosine_similarity(user_movie_matrix)
np.fill_diagonal(user_similarity, 0)
user_similarity_df = pd.DataFrame(
    user_similarity, index=user_movie_matrix.index, columns=user_movie_matrix.index)

movies_similarity = cosine_similarity(user_movie_matrix.T)
np.fill_diagonal(movies_similarity, 0)
movies_similarity_df = pd.DataFrame(
    movies_similarity, index=user_movie_matrix.columns, columns=user_movie_matrix.columns)

movie_genre_merged = movies_genres_df.merge(
    genres_df,
    left_on="genre_id",
    right_on="genre_id")

movie_genre_list = movie_genre_merged.groupby(
    "movieId")["genre_name"].apply(list)
movie_genre_list = movie_genre_list.reindex(movies_df["movieId"]).fillna([])

mlb = MultiLabelBinarizer()

genre_matrix = mlb.fit_transform(movie_genre_list)

genre_df = pd.DataFrame(
    genre_matrix, index=movies_df["movieId"], columns=mlb.classes_)

genre_similarity = cosine_similarity(genre_df)
np.fill_diagonal(genre_similarity, 0)

genre_similarity_df = pd.DataFrame(
    genre_similarity, index=genre_df.index, columns=genre_df.index)

alpha = 0.7  # collaborative filtering
beta = 0.3   # genres
gamma = 0.6  # user similarity
delta = 0.4  # item similarity

final_movie_similarity = (
    alpha * movies_similarity_df +
    beta * genre_similarity_df
)


def predict_user_based(user_id):
    sim_users = user_similarity_df[user_id]

    # enlever soi-même
    sim_users = sim_users.drop(user_id)

    # users les plus similaires
    top_users = sim_users.sort_values(ascending=False).head(20)

    # ratings des autres users
    ratings = user_movie_matrix.loc[top_users.index]

    # weighted sum
    scores = top_users.values @ ratings

    norm = np.sum(np.abs(top_users.values))

    return scores / (norm + 1e-8)


def predict_item_based(user_id):
    user_ratings = user_movie_matrix.loc[user_id]

    # films que l'utilisateur a notés
    rated_items = user_ratings[user_ratings != 0]

    scores = {}

    for movie_id in final_movie_similarity.index:

        sim_vector = final_movie_similarity.loc[movie_id, rated_items.index]

        numerator = np.sum(sim_vector.values * rated_items.values)
        denominator = np.sum(np.abs(sim_vector.values)) + 1e-8

        scores[movie_id] = numerator / denominator

    return pd.Series(scores)


def build_recommendations_for_user(user_id, alpha=0.3, beta=0.7):

    user_scores = predict_user_based(user_id)
    item_scores = predict_item_based(user_id)

    # align
    user_scores = user_scores.fillna(0)
    item_scores = item_scores.fillna(0)

    final_scores = gamma * user_scores + delta * item_scores

    # remove seen
    seen = user_movie_matrix.loc[user_id]
    seen = seen[seen != 0].index
    final_scores = final_scores.drop(seen, errors="ignore")

    # ranking
    final_scores = final_scores.sort_values(ascending=False)

    df = final_scores.reset_index()
    df.columns = ["movie_id", "score"]
    df["user_id"] = user_id
    df["ranking"] = range(1, len(df) + 1)

    return df


all_users = user_movie_matrix.index

all_recs = []

for user_id in all_users:
    df = build_recommendations_for_user(user_id)
    all_recs.append(df)

final_df = pd.concat(all_recs)


def write_recommendations_to_db(recs_df, db_path):

    cols = ["user_id", "movie_id", "score", "ranking"]
    recs_df = recs_df.copy()
    recs_df = recs_df[cols]
    recs_df["user_id"] = recs_df["user_id"].astype(int)
    recs_df["movie_id"] = recs_df["movie_id"].astype(int)
    recs_df["ranking"] = recs_df["ranking"].astype(int)
    recs_tuples = list(recs_df.itertuples(index=False, name=None))

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.executemany(
        "INSERT OR REPLACE INTO Recommandation (user_id, movie_id, score, ranking) VALUES (?, ?, ?, ?);",
        recs_tuples
    )

    conn.commit()
    conn.close()


write_recommendations_to_db(final_df, db_path)
