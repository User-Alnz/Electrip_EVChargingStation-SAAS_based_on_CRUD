CREATE TABLE user_account (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(64) NOT NULL,
    lastname VARCHAR(64) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE station (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_station VARCHAR(100),
  n_station VARCHAR(100),
  ad_station VARCHAR(150),
  xlongitude FLOAT,
  ylatitude FLOAT,
  nbre_pdc INT,
  acces_recharge VARCHAR(100),
  accessibilite VARCHAR(50),
  puiss_max DECIMAL,
  type_prise VARCHAR(50)
);

CREATE TABLE bornes (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_station VARCHAR(100),
  station_id INT UNSIGNED NOT NULL,

  CONSTRAINT fk_station FOREIGN KEY (station_id) REFERENCES station(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE reservation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  borne_id INT NOT NULL,
  user_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  start_using DATETIME NULL,
  end_time DATETIME NOT NULL,
  status ENUM('reserved', 'used', 'cancelled'),

  CONSTRAINT fk_bornes FOREIGN KEY (borne_id) REFERENCES bornes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_account FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE ON UPDATE CASCADE
);