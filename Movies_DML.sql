/* INSERT DML queries */
-- Add a new Genre row
INSERT INTO Genres (genre)
VALUES (:genreInput);

-- Add a new Movies row
INSERT INTO Movies (movieTitle, releaseYear, runtime, ratingIMDB, ratingRottenTomatoes, genre)
VALUES  (:movieTitleInput, :releaseYearInput, :runtimeInput, :ratingIMDBInput, :ratingRottenTomatoesInput, genreInput;);

-- Add a new Actors row
INSERT INTO Actors (actorLastName, actorFirstName)
VALUES (:actorFirstNameInput, :actorLastNameInput);

-- Add a new Movies_Actors row
INSERT INTO Movies_Actors (movieID, actorID)
VALUES (:movieIDInput, :actorIDInput);

-- Add a new OscarWinners row
INSERT INTO OscarWinners (year, bestPicture, leadActor, leadActress)
VALUES (:yearInput, :movieIDInput, :actorIDInput, :actorIDInput);


/* SELECT DML queries */
-- SELECT from the Genres table
SELECT genre AS ID FROM Genres ORDER BY genre ASC;

-- SELECT from the Movies table
SELECT movieID AS ID, movieTitle, releaseYear, runtime, ratingIMDB, ratingRottenTomatoes, genre FROM Movies ORDER BY movieTitle ASC;

-- SELECT from the Actors table
SELECT actorID AS ID, actorLastName, actorFirstName FROM Actors ORDER BY actorLastName ASC;

-- SELECT from the Movies_Actors table
SELECT m.movieID AS ID, a.actorID AS ID2, movieTitle, CONCAT(actorFirstName, " ", actorLastName) FROM Movies_Actors ma INNER JOIN Movies m ON ma.movieID = m.movieID INNER JOIN Actors a ON ma.actorID = a.actorID ORDER BY movieTitle ASC;

-- SELECT from the OscarWinners table
SELECT o.year AS ID, (SELECT movieTitle FROM Movies INNER JOIN OscarWinners ON Movies.movieID = OscarWinners.bestPicture WHERE OscarWinners.year = o.year), (SELECT CONCAT(actorFirstName, " ", actorLastName) FROM Actors INNER JOIN OscarWinners ON Actors.actorID = OscarWinners.leadActor WHERE OscarWinners.year = o.year), (SELECT CONCAT(actorFirstName, " ", actorLastName) FROM Actors INNER JOIN OscarWinners ON Actors.actorID = OscarWinners.leadActress WHERE OscarWinners.year = o.year) FROM OscarWinners o ORDER BY year DESC;

-- SELECT Top 50 movies from DB
SELECT movieTitle, releaseYear, m.genre, IF(bestPicture IS NOT NULL, "Yes", "No"), ((ratingIMDB * 10) + ratingRottenTomatoes)/2 AS score FROM Movies m INNER JOIN Genres g ON m.genre = g.genre LEFT JOIN OscarWinners o ON m.movieID = o.bestPicture ORDER BY score DESC LIMIT 50;

-- SELECT all movies from the Movies table (for dropdown menu)
SELECT movieID, movieTitle FROM Movies ORDER BY movieTitle ASC;

-- SELECT all genres from the Genres table (for dropdown menu)
SELECT genre FROM Genres ORDER BY genre ASC;

-- SELECT all actors from the Actors table (for dropdown menu)
SELECT actorID, CONCAT(actorFirstName, " ", actorLastName) AS actor FROM Actors ORDER BY actorFirstName ASC;


/* Dynamic Search DML queries */

-- Search by movie title
SELECT movieTitle, releaseYear, m.genre, IF(bestPicture IS NOT NULL, 'Yes', 'No'), (((ratingIMDB * 10) + ratingRottenTomatoes)/2) AS score FROM (Movies m INNER JOIN Genres g ON m.genre = g.genre LEFT JOIN OscarWinners o ON m.movieID = o.bestPicture) WHERE movieTitle LIKE '%:phraseInput%';

-- Search by actor first name
SELECT * FROM Movies_Actors WHERE actorFirstName LIKE ':actorFirstNameSearchInput%';

-- Search by genre
SELECT movieTitle, releaseYear, m.genre, IF(bestPicture IS NOT NULL, 'Yes', 'No'), (((ratingIMDB * 10) + ratingRottenTomatoes)/2) AS score FROM (Movies m INNER JOIN Genres g ON m.genre = g.genre LEFT JOIN OscarWinners o ON m.movieID = o.bestPicture) WHERE m.genre LIKE '%:phraseInput%';

-- Search by year
SELECT movieTitle, releaseYear, m.genre, IF(bestPicture IS NOT NULL, 'Yes', 'No'), (((ratingIMDB * 10) + ratingRottenTomatoes)/2) AS score FROM (Movies m INNER JOIN Genres g ON m.genre = g.genre LEFT JOIN OscarWinners o ON m.movieID = o.bestPicture) WHERE releaseYear LIKE '%:phraseInput%';


/* UPDATE DML queries */
-- Update Genres table
UPDATE Genres
SET genre= :newGenreInput
WHERE genre= :genre;

-- Update Movies table
UPDATE Movies
SET movieTitle: movieTitleInput, releaseYear= :releaseYearInput, runtime= :runtimeInput, ratingIMDB= :ratingIMDBInput, ratingRottenTomatoes= ratingRottenTomatoesInput, genre= :genreInput
WHERE movieID= :movieID;

-- Update Actors table
UPDATE Actors
SET actorLastName= :actorLastNameInput, actorFirstName= :actorFirstNameInput
WHERE actorID= :actorID;

-- Update OscarWinners table
UPDATE OscarWinners
SET year= :yearInput, bestPicture= :movieIDInput, leadActor= :actorIDInput, leadActress= :actorIDInput
WHERE year= :year;

-- Update Movies_Actors table
UPDATE Movies_Actors
SET movieID = :movieIDInput, actorID= :actorIDInput
WHERE movieID= :movieID AND actorID= :actorID;


/* DELETE DML queries */
-- Delete from the Genre table
DELETE FROM Genre WHERE genre= :genreInput;

-- Delete from the Movies table
DELETE FROM Movies WHERE movieID= :movieIDInput;

-- Delete from the Actors table
DELETE FROM Actors WHERE actorID= :actorIDInput;

-- Delete from the Movies_Actors table
DELETE FROM Movies_Actors WHERE movieID= :movieIDInput AND actorID= :actorIDInput;

-- Delete from the OscarWinners table
DELETE FROM OscarWinners WHERE year= :yearInput;


