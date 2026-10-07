/*
===============
LOAD MOTOGP.TXT
===============
1. Open terminal in Web/motogp/data.
2. Run: "sqlite3 /Users/victorschipilow/Workspace/common/databases/MotoGP.db"
3. Run: .read loadMotoGP.sql
*/

.mode json

.once motogp.json

 SELECT Comp, 
        Year, 
       [Number], 
       [First Name] AS FirstName,
        Surname, 
        Country, 
        Constructor AS Bike, 
        Team,
        Birthdate, 
       [Test Rider] AS TestRider
   FROM MotoGP
  ORDER BY ROUND([Number]); 
