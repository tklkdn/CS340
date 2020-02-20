DROP TABLE IF EXISTS Genres;

CREATE TABLE Genres (
	genre varchar(255) NOT NULL,
	PRIMARY KEY (genre),
	UNIQUE (genre)
);

INSERT INTO Genres (genre) VALUES
("action"), ("adventure"), ("comedy"), ("crime"), ("drama"), ("epic"), ("fantasy"), ("history"), ("horror"), ("musical"), ("mystery"), ("romance"), ("sci-fi"), ("superhero"), ("thriller"), ("war"), ("western");


DROP TABLE IF EXISTS Movies;

CREATE TABLE Movies (
	movieID int(11) NOT NULL,
	movieTitle varchar(255) NOT NULL,
	releaseYear int(11) NOT NULL,
	runtime int(11) NOT NULL,
	ratingIMDB decimal(2, 1),
	ratingRottenTomatoes int(11),
	genre varchar(255),
	PRIMARY KEY (movieID),
	FOREIGN KEY (genre) REFERENCES Genres(genre)
);

INSERT INTO Movies ('movieTitle', 'releaseYear', 'runtime', 'ratingIMDB', 'ratingRottenTomatoes', 'genre') VALUES 
("Parasite", 2019, 132, 8.6, 99, "drama"),
("Green Book", 2018, 130, 8.2, 78, "drama"),
("The Shape of Water", 2017, 123, 7.3, 92, "fantasy"),
("Moonlight", 2016, 111, 7.4, 98, "drama"),
("Spotlight", 2015, 129, 8.1, 97, "history"),
("Birdman", 2014, 119, 7.7, 97, "drama"),
("12 Years a Slave", 2013, 134, 8.1, 95, "drama"),
("Argo", 2012, 130, 7.7, 96, "history"),
("The Artist", 2011, 114, 7.9, 95, "drama"),
("The King's Speech", 2010, 119, 8, 95, "history"),
("The Hurt Locker", 2009, 131, 7.6, 97, "war"),
("The Slumdog Millionaire", 2008, 123, 8, 91, "drama"),
("No Country for Old Men", 2007, 123, 8.1, 93, "drama"),
("The Departed", 2006, 151, 8.5, 91, "drama"),
("Crash", 2005, 115, 7.8, 74, "drama"),
("Million Dollar Baby", 2004, 137, 8.7, 91, "drama"),
("The Lord of the Rings: The Return of the King", 2003, 201, 8.9, 93, "fantasy"),
("Chicago", 2002, 113, 7.1, 86, "musical"),
("A Beautiful Mind", 2001, 140, 8.2, 74, "drama"),
("Gladiator", 2000, 155, 8.5, 76, "epic"),
("American Beauty", 1999, 122, 8.3, 87, "drama"),
("Shakespeare in Love", 1998, 123, 7.1, 92, "romance"),
("Titanic", 1997, 195, 7.8, 89, "drama"),
("The English Patient", 1996, 162, 7.4, 85, "drama"),
("Braveheart", 1995, 178, 8.3, 76, "war"),
("Forrest Gump", 1994, 142, 8.8, 70, "drama"),
("Schindler's List", 1993, 195, 8.9, 97, "history"),
("Unforgiven", 1992, 131, 8.2, 96, "western"),
("The Silence of the Lambs", 1991, 118, 8.6, 96, "mystery"),
("Dances with Wolves", 1990, 181, 8, 83, "western"),
("Driving Miss Daisy", 1989, 100, 7.4, 81, "comedy"),
("Rain Man", 1988, 133, 8, 90, "drama"),
("The Last Emperor", 1987, 163, 7.7, 90, "history"),
("Platoon", 1986, 120, 8.1, 88, "war"),
("Out of Africa", 1985, 161, 7.2, 58, "drama"),
("Amadeus", 1984, 161, 8.3, 93, "history"),
("Terms of Endearment", 1983, 132, 7.4, 78, "comedy"),
("Gandhi", 1982, 191, 8, 84, "history"),
("Chariots of Fire", 1981, 124, 7.2, 84, "history"),
("Ordinary People", 1980, 124, 7.7, 88, "drama"),
("Kramer vs. Kramer", 1979, 104, 7.8, 88, "drama"),
("The Deer Hunter", 1978, 183, 8.1, 93, "war"),
("Annie Hall", 1977, 93, 8, 97, "comedy"),
("Rocky", 1976, 119, 8.1, 94, "drama"),
("One Flew Over the Cuckoo's Nest", 1975, 133, 8.7, 93, "comedy"),
("The Godfather Part II", 1974, 200, 9, 97, "crime"),
("The Sting", 1973, 129, 8.3, 94, "crime"),
("The Godfather", 1972, 177, 9.2, 98, "crime"),
("The French Connection", 1971, 104, 7.7, 98, "crime"),
("Patton", 1970, 170, 7.9, 94, "history"),
("Midnight Cowboy", 1969, 113, 7.8, 90, "drama"),
("Oliver!", 1968, 153, 7.4, 82, "musical"),
("In the Heat of the Night", 1967, 109, 8, 94, "mystery"),
("A Man for All Seasons", 1966, 120, 7.7, 83, "drama"),
("The Sound of Music", 1965, 174, 8, 84, "musical"),
("My Fair Lady", 1964, 170, 7.8, 95, "musical"),
("Tom Jones", 1963, 128, 6.5, 86, "adventure"),
("Lawrence of Arabia", 1962, 180, 8.3, 98, "epic"),
("West Side Story", 1961, 152, 7.5, 92, "musical"),
("The Apartment", 1960, 125, 8.3, 93, "romance"),
("Ben-Hur", 1959, 212, 8.1, 86, "epic"),
("Gigi", 1958, 115, 6.7, 80, "musical"),
("The Bridge on the River Kwai", 1957, 161, 8.1, 95, "war"),
("Around the World in 80 Days", 1956, 182, 6.8, 72, "adventure"),
("On the Waterfront", 1954, 108, 8.1, 98, "crime"),
("Marty", 1955, 90, 7.7, 100, "romance"),
("From Here to Eternity", 1953, 118, 7.6, 91, "drama"),
("The Greatest Show on Earth", 1952, 152, 6.6, 43, "drama"),
("An American in Paris", 1951, 113, 7.2, 96, "musical"),
("All About Eve", 1950, 138, 8.2, 99, "drama"),
("All the King's Men", 1949, 110, 7.5, 95, "drama"),
("Hamlet", 1948, 155, 7.6, 95, "drama"),
("Gentleman's Agreement", 1947, 118, 7.2, 74, "drama"),
("The Best Years of Our Lives", 1946, 172, 8, 96, "drama"),
("The Lost Highway", 1945, 99, 7.9, 100, "drama"),
("Going My Way", 1944, 126, 7.1, 83, "musical"),
("Casablanca", 1942, 102, 8.5, 98, "drama"),
("Mrs. Miniver", 1942, 133, 7.6, 93, "drama"),
("How Green Was My Valley", 1941, 118, 7.7, 91, "drama"),
("Rebecca", 1940, 130, 8.1, 100, "thriller"),
("Gone with the Wind", 1939, 221, 8.1, 91, "epic"),
("You Can't Take It with You", 1938, 126, 7.9, 93, "romance"),
("The Life of Emile Zola", 1937, 116, 7.2, 81, "drama"),
("The Great Ziegfeld", 1936, 177, 6.7, 66, "musical"),
("Mutiny on the Bounty", 1935, 132, 7.7, 1935, "drama"),
("It Happened One Night", 1934, 105, 8.1, 98, "romance"),
("Cavalcade", 1933, 112, 5.8, 63, "epic"),
("Grand Hotel", 1932, 112, 7.4, 88, "drama"),
("Cimarron", 1931, 124, 5.9, 52, "western"),
("All Quiet on the Western Front", 1930, 152, 8, 98, "epic"),
("The Broadway Melody", 1929, 100, 5.7, 36, "musical"),
("Wings", 1927, 111, 7.5, 93, "war"),
("The Shawshank Redemption", 1994, 142, 9.3, 90, "drama"),
("The Dark Knight", 2008, 152, , , "superhero"),
("12 Angry Men", 1957, 96, 8.9, 100, "drama"),
("Pulp Fiction", 1994, 154, 8.9, 81, "crime"),
("The Good, the Bad, and the Ugly", 1966, 177, 8.8, 97, "western"),
("The Lord of the Rings: The Fellowship of the Kings", 2001, 178, 8.8, 91, "fantasy"),
("Fight Club", 1999, 139, 8.8, 79, "drama"),
("Inception", 2010, 148, 8.8, 87, "sci-fi"),
("Star Wars: Episode V - The Empire Strikes Back", 1980, 124, 8.7, 94, "sci-fi"),
("The Lord of the Rings: The Two Towers", 2002, 179, 8.7, 95, "fantasy"),
("The Matrix", 1999, 136, 8.7, 88, "sci-fi"),
("Goodfellas", 1990, 146, 8.7, 96, "crime"),
("Seven Samurai", 1954, 207, 8.6, 100, "epic"),
("Se7en", 1995, 127, 8.6, 81, "crime"),
("City of God", 2002, 130, 8.6, 91, "crime"),
("Life Is Beautiful", 1997, 116, 8.6, 80, "drama"),
("It's a Wonderful Life", 1946, 135, 8.6, 94, "drama"),
("Star Wars: Episode IV - A New Hope", 1977, 121, 8.6, 93, "sci-fi"),
("Saving Private Ryan", 1998, 169, 8.6, 93, "war"),
("Spirited Away", 2001, 125, 8.6, 97, "fantasy"),



DROP TABLE IF EXISTS Actors;

CREATE TABLE Actors (
	actorID int(11) NOT NULL,
	actorLastName varchar(255) NOT NULL,
	actorFirstName varchar(255) NOT NULL,
	PRIMARY KEY (actorID)
)

INSERT INTO Actors ('actorLastName', 'actorFirstName') VALUES
('Abraham', 'F. Murray'), ('Adams', 'Amy'), ('Affleck', 'Casey'), ('Allen', 'Woody'), ('Andrews', 'Julie'), ('Arkin', 'Alan'), ('Arliss', 'George'), ('Bale', 'Christian'), ('Bancroft', 'Anne'), ('Barrymore', 'Lionel'), ('Bathy', 'Kathy'), ('Baxter', 'Barner'), ('Beatty', 'Warren'), ('Beery', 'Wallace'), ('Benigni', 'Roberto'), ('Bening', 'Annette'), ('Bergman', 'Ingrid'), ('Berry', 'Halle'), ('Blanchett', 'Cate'), ('Bogart', 'Humphrey'), ('Booth', 'Shirley'), ('Borgnine', 'Ernest'), ('Brando', 'Marlon'), ('Bridges', 'Jeff'), ('Brody', 'Adrian'), ('Brynner', 'Yul'), ('Bullock', 'Sandra'), ('Burstyn', 'Ellen'), ('Burton', 'Richard'), ('Cage', 'Nicholas'), ('Cagney', 'James'), ('Caine', 'Michael'), ('Carell', 'Steve'), ('Carney', 'Art'), ('Christie', 'Julie'), ('Clooney', 'George'), ('Close', 'Glenn'), ('Colbert', 'Claudette'), ('Colman', 'Olivia'), ('Colman', 'Ronald'), ('Cooper', 'Bradley'), ('Cooper', 'Gary'), ('Cotillard', 'Marion'), ('Crawford', 'Broderick'), ('Crawford', 'Joan'), ('Crosby', 'Bing'), ('Crowe', 'Russell'), ('Cruise', 'Tom'), ('Cumberbatch', 'Benedict'), ('Dafoe', 'Willem'), ('David', 'Niven'), ('Davis', 'Bette'), ('Day', 'Doris'), ('Day-Lewis', 'Daniel'), ('De Niro', 'Robert'), ('Dean', 'James'), ('Dench', 'Judi'), ('Depp', 'Johnny'), ('Dern', 'Laura'), ('DiCaprio', 'Leonardo'), ('Donat', 'Robert'), ('Douglas', 'Kirk'), ('Douglas', 'Michael'), ('Dressler', 'Marie'), ('Dreyfuss', 'Richard'), ('Dujardin', 'Jean'), ('Dunaway', 'Faye'), ('Duvall', 'Robert'), ('Eddie', 'Redmayne'), ('Fassbender', 'Michael'), ('Ferrer', 'José'), ('Field', 'Sally'), ('Fiennes', 'Ralph'), ('Finch', 'Peter'), ('Finney', 'Albert'), ('Firth', 'Colin'), ('Fletcher', 'Louise'), ('Fonda', 'Henry'), ('Fonda', 'Jane'), ('Fontaine', 'Joan'), ('Foster', 'Jodie'), ('Foxx', 'Jamie'), ('Freeman', 'Morgan'), ('Gable', 'Clark'), ('Garbo', 'Greta'), ('Garfield', 'John'), ('Garland', 'Judy'), ('Garson', 'Greer'), ('Gaynor', 'Janet'), ('Gosling', 'Ryan'), ('Grant', 'Cary'), ('Guinness', 'Alec'), ('Hackman', 'Gene'), ('Hanks', 'Tom'), ('Harrison', 'Rex'), ('Hayes', 'Helen'), ('Hayward', 'Susan'), ('Hepburn', 'Audrey'), ('Hepburn', 'Katharine'), ('Heston', 'Charlton'), ('Hoffman', 'Dustin'), ('Hoffman', 'Philip'), ('Holden', 'William'), ('Holiday', 'Judy'), ('Hopkins', 'Anthony'), ('Huffman', 'Felicity'), ('Hunt', 'Helen'), ('Hunter', 'Holly'), ('Hurt', 'William'), ('Irons', 'Jeremy'), ('Jackman', 'Hugh'), ('Jackson', 'Glenda'), ('Jannings', 'Emil'), ('Johansson', 'Scarlett'), ('Jones', 'Jennifer'), ('Keaton', 'Diane'), ('Kelly', 'Gene'), ('Kelly', 'Grace'), ('Kidman', 'Nicole'), ('Kingsley', 'Ben'), ('Lancaster', 'Burt'), ('Lange', 'Jessica'), ('Larson', 'Brie'), ('Laughton', 'Charles'), ('Lawrence', 'Jennifer'), ('Leigh', 'Vivien'), ('Lemmon', 'Jack'), ('Loren', 'Sophia'), ('Lukas', 'Paul'), ('MacLaine', 'Shirley'), ('Magnani', 'Anna'), ('Malek', 'Rami'), ('March', 'Fredric'), ('Marvin', 'Lee'), ('Matlin', 'Marlee'), ('McConaughey', 'Matthew'), ('McDormand', 'Frances'), ('McKellen', 'Ian'), ('McLaglen', 'Victor'), ('McQueen', 'Steve'), ('Midler', 'Bette'), ('Milland', 'Ray'), ('Minnelli', 'Liza'), ('Mirren', 'Helen'), ('Monroe', 'Marilyn'), ('Moore', 'Julianne'), ('Moore', 'Mary Tyler'), ('Mortensen', 'Viggo'), ('Muni', 'Paul'), ('Neal', 'Patricia'), ('Neeson', 'Liam'), ('Newman', 'Paul'), ('Nicholson', 'Jack'), ("O'Toole", 'Peter'), ('Oldman', 'Gary'), ('Olivier', 'Laurence'), ('Pacino', 'Al'), ('Page', 'Geraldine'), ('Paltrow', 'Gwyneth'), ('Peck', 'Gregory'), ('Penn', 'Sean'), ('Phoenix', 'Joaquin'), ('Pickford', 'Mary'), ('Pitt', 'Brad'), ('Poiter', 'Sidney'), ('Portman', 'Natalie'), ('Rainer', 'Luise'), ('Redgrave', 'Vanessa'), ('Roberts', 'Julia'), ('Robertson', 'Cliff'), ('Rogers', 'Ginger'), ('Ronan', 'Saoirse'), ('Rooney', 'Mickey'), ('Rush', 'Geoffrey'), ('Sarandon', 'Susan'), ('Sarkisian', 'Cherilyn'), ('Schell', 'Maximilian'), ('Scofield', 'Paul'), ('Scott', 'George C.'), ('Sellers', 'Peter'), ('Shearer', 'Norma'), ('Signoret', 'Simone'), ('Smith', 'Maggie'), ('Spacek', 'Sissy'), ('Spacey', 'Kevin'), ('Steiger', 'Rod'), ('Stewart', 'James'), ('Stone', 'Emma'), ('Streep', 'Meryl'), ('Streisand', 'Barbra'), ('Swank', 'Hilary'), ('Tandy', 'Jessica'), ('Taylor', 'Elizabeth'), ('Theron', 'Charlize'), ('Thompson', 'Emma'), ('Tracy', 'Spencer'), ('Ullmann', 'Liv'), ('Voight', 'Jon'), ('Washington', 'Denzel'), ('Watts', 'Naomi'), ('Wayne', 'John'), ('Weaver', 'Sigourney'), ('Whitaker', 'Forest'), ('Whitherspoon', 'Reese'), ('Williams', 'Michelle'), ('Williams', 'Robin'), ('Winger', 'Debra'), ('Winslet', 'Kate'), ('Wood', 'Natalie'), ('Woodward', 'Joanne'), ('Wyman', 'Jane'), ('Young', 'Loretta'), ('Zellweger', 'Renée'), ('de Havilland', 'Olivia');


DROP TABLE IF EXISTS Movies_Actors;

CREATE TABLE Movies_Actors (
	movieID int(11) NOT NULL,
	actorID int(11) NOT NULL,
	PRIMARY KEY (movieID, actorID),
	FOREIGN KEY (movieID) REFERENCES Movies(movieID),
	FOREIGN KEY (actorID) REFERENCES Actors(actorID)
);


DROP TABLE IF EXISTS OscarWinners;

CREATE TABLE OscarWinners (
	'year' int(11) NOT NULL,
	bestPicture int(11),
	leadActor int(11),
	leadActress int(11),
	PRIMARY KEY ('year'),
	UNIQUE ('year'),
	FOREIGN KEY (bestPicture) REFERENCES Movies(movieID),
	FOREIGN KEY (leadActor)
	
)