import sqlite3
import pandas as pd

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

# Example: Print the DataFrames to verify
print("Users DataFrame:")
print(users_df.head())

print("\nMovies DataFrame:")
print(movies_df.head())

print("\nRatings DataFrame:")
print(ratings_df.head())

print("\nMovies-Genres DataFrame:")
print(movies_genres_df.head())

print("\nGenres DataFrame:")
print(genres_df.head())

movie_user_matrix = ratings_df.pivot(index='userId', columns='movieId', values='rating')
