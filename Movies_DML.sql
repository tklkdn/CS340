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
VALUES ((SELECT movieID FROM Movies WHERE movieTitle= :movieTitleInput), (SELECT actorID FROM Actors WHERE actorLastName= :actorLastNameInput AND actorFirstName= :actorFirstNameInput));

-- Add a new OscarWinners row
INSERT INTO OscarWinners (year, bestPicture, leadActor, leadActress)
VALUES (:releaseYearInput, (SELECT movieID FROM Movies WHERE movieTitle= :movieTitleInput), (SELECT actorID FROM Actors WHERE actorLastName= :actorLastNameInput AND actorFirstName= :actorFirstNameInput), (SELECT actorID FROM Actors WHERE actorLastName= :actorLastNameInput AND actorFirstName= :actorFirstNameInput));

/* SELECT DML queries */
-- SELECT from the Genre table
SELECT * FROM Genre;

-- SELECT from the Movie table
SELECT * FROM Movies;

-- SELECT from the Actor table
SELECT * FROM Actors;

-- SELECT from the Movies_Actors table
SELECT * FROM Movies_Actors;

-- SELECT from the OscarWinners table
SELECT * FROM OscarWinners;

/* Dynamic Search DML queries */

-- Search by movie title
SELECT * FROM Movies_Actors WHERE movieTitle LIKE ':movieTitleSearchInput%';

-- Search by actor first name
SELECT * FROM Movies_Actors WHERE actorFirstName LIKE ':actorFirstNameSearchInput%';


/* UPDATE DML queries */
-- Update Genres table
UPDATE Genres
SET genre= :newGenreInput
WHERE genre= :genreInput;

-- Update Movies table
UPDATE Movies
SET movieTitle: movieTitleInput, releaseYear= :releaseYearInput, runtime= :runtimeInput, ratingIMDB= :ratingIMDBInput, ratingRottenTomatoes= ratingRottenTomatoesInput, genre= :genreInput
WHERE movieID= :movieIDInput;

-- Update Actors table
UPDATE Actors
SET actorLastName= :actorLastNameInput, actorFirstName= :actorFirstNameInput
WHERE actorID= :actorIDInput;

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


