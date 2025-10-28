module.exports = {
  // Adress Server
  // LOCAL
  uri: 'http://192.168.1.17:3000/',
  urichat: 'http://192.168.1.17:3001/',
  // serveur OVH (la Bonne)
  //uri : 'https://api.mybuddydiary.com/',
  //urichat : 'http://XXXX:XXXX/',

  // Link Server for User,
  // LOCAL
  linkserver: 'http://192.168.1.17:3000/users/',
  // serveur OVH (la Bonne)
  //linkserver : 'https://api.mybuddydiary.com/users/',


  app: {
    version: "1.1.1",
  },

  textEllipsis: function (str: string, maxLength: number, { side = "end", ellipsis = "..." } = {}) {
    if (str) {
      var stringa = str.toLowerCase();
      return stringa.charAt(0).toUpperCase() + stringa.slice(1);
    }
    if (stringa.length > maxLength) {
      switch (side) {
        case "start":
          return ellipsis + stringa.slice(-(maxLength - ellipsis.length));
        case "end":
        default:
          return stringa.slice(0, maxLength - ellipsis.length) + ellipsis;
      }
    }
    return str;
  },

  textEllipsis2: function (str, maxLength, { side = "end", ellipsis = "..." } = {}) {
    if (str.length > maxLength) {
      switch (side) {
        case "start":
          return ellipsis + str.slice(-(maxLength - ellipsis.length));
        case "end":
        default:
          return str.slice(0, maxLength - ellipsis.length) + ellipsis;
      }
    }
    return str;
  },
  textEllipsisNoCapitalize: function (str, maxLength, { side = "end", ellipsis = "..." } = {}) {
    if (str.length > maxLength) {
      switch (side) {
        case "start":
          return ellipsis + str.slice(-(maxLength - ellipsis.length));
        case "end":
        default:
          return str.slice(0, maxLength - ellipsis.length) + ellipsis;
      }
    }
    return str;
  },


  filterName: function (str: string, maxLength: number, { side = "end", ellipsis = "..." } = {}) {
    if (str.length > maxLength) {
      switch (side) {
        case "start":
          return ellipsis + str.slice(-(maxLength - ellipsis.length));
        case "end":
        default:
          return str.slice(0, maxLength - ellipsis.length) + ellipsis;
      }
    }
    return str;
  },

  randomkey: function (length: any) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPKRSTUVWXYZ'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  },

  // Max length characters
  maxLength: {
    characters: 400,
  },


  // BadWords List
  BadWords: ["fellations"
  ],
  isPremiumIcone: {
    ispremium: require('./assets/images/logo_premium.png'),
  },

  // Animal Map
  animalPinMap : {
    cat: require("./assets/images/pin_cat.png"),
    dog: require("./assets/images/pin_dog.png"),
    bird: require("./assets/images/pin_bird.png"),
    spider: require("./assets/images/pin_spider.png"),
    hamster: require("./assets/images/pin_hamster.png"),
    turtle: require("./assets/images/pin_turtle.png"),
    furet: require("./assets/images/pin_furet.png"),
    reptile: require("./assets/images/pin_reptile.png"),
    snake: require("./assets/images/pin_snake.png"),
    mouse: require("./assets/images/pin_mouse.png"),
    horse: require("./assets/images/pin_horse.png"),
    bug: require("./assets/images/pin_bug.png"),
    pig: require("./assets/images/pin_pig.png"),
    cow: require("./assets/images/pin_cow.png"),
    sheep: require("./assets/images/pin_sheep.png"),
    fish: require("./assets/images/pin_fish.png"),
    rabbit: require("./assets/images/pin_rabbit.png"),
    goat: require("./assets/images/pin_goat.png"),
    oiseaux: require('./assets/images/pin_bird.png'),
  },
  // Animal Icons & Genre 
  AnimalIcones: {
    typeofname: {
      ovin: require('./assets/images/pin_sheep.png'),
      sheep: require('./assets/images/pin_sheep.png'),
      bovin: require('./assets/images/pin_cow.png'),
      bovine: require('./assets/images/pin_cow.png'),
      donkey : require('./assets/images/pin_horse.png'),
      ane : require('./assets/images/pin_horse.png'),
      poney: require('./assets/images/pin_horse.png'),
      dog: require('./assets/images/pin_dog.png'),
      cat: require('./assets/images/pin_cat.png'),
      rabbit: require('./assets/images/pin_rabbit.png'),
      fish: require('./assets/images/pin_fish.png'),
      guinea_pig: require('./assets/images/pin_hamster.png'),
      hamster: require('./assets/images/pin_hamster.png'),
      bird: require('./assets/images/pin_bird.png'),
      bug: require('./assets/images/pin_bug.png'),
      horse: require('./assets/images/pin_horse.png'),
      mouse: require('./assets/images/pin_mouse.png'),
      reptile: require('./assets/images/pin_reptile.png'),
      snake: require('./assets/images/pin_reptile.png'),
      rat: require('./assets/images/pin_mouse.png'),
      chinchilla: require('./assets/images/pin_mouse.png'),
      ferret: require('./assets/images/pin_furet.png'),
      turtle: require('./assets/images/pin_reptile.png'),
      squirrel: require('./assets/images/pin_hamster.png'),
      gerbil: require('./assets/images/pin_mouse.png'),
      gerbille: require('./assets/images/pin_mouse.png'),
      chicken: require('./assets/images/pin_bird.png'),
      spider: require('./assets/images/pin_spider.png'),
      chien: require('./assets/images/pin_dog.png'),
      chat: require('./assets/images/pin_cat.png'),
      lapin: require('./assets/images/pin_rabbit.png'),
      poisson: require('./assets/images/pin_fish.png'),
      cobaye: require('./assets/images/pin_hamster.png'),
      oiseaux: require('./assets/images/pin_bird.png'),
      insecte: require('./assets/images/pin_bug.png'),
      cheval: require('./assets/images/pin_horse.png'),
      souris: require('./assets/images/pin_mouse.png'),
      serpent: require('./assets/images/pin_snake.png'),
      tortue: require('./assets/images/pin_turtle.png'),
      furret: require('./assets/images/pin_furet.png'),
      ecureuil: require('./assets/images/pin_hamster.png'),
      poule: require('./assets/images/pin_bird.png'),
      araignée: require('./assets/images/pin_spider.png'),
      vache: require('./assets/images/pin_cow.png'),
      mouton: require('./assets/images/pin_sheep.png'),
      taureau: require('./assets/images/pin_bull.png'),
      cochon: require('./assets/images/pin_pig.png'),
      chevre: require('./assets/images/pin_goat.png'),
      octodon: require('./assets/images/pin_mouse.png'),
      femelle_off: require('./assets/images/femelle_off.png'),
      femelle_on: require('./assets/images/femelle_on.png'),
      male_off: require('./assets/images/male_off.png'),
      male_on: require('./assets/images/male_on.png'),
      heart: require('./assets/images/pin_heart.png'),
      lof: require('./assets/images/lof.png'),
      wantbaby: require('./assets/images/wantbaby.png'),
    }
  },
  AnimalIcones_fr: {
    typeofname: {
      ovin: require('./assets/images/pin_sheep.png'),
      sheep: require('./assets/images/pin_sheep.png'),
      bovin: require('./assets/images/pin_bull.png'),
      bovine: require('./assets/images/pin_bull.png'),
      donkey : require('./assets/images/pin_horse.png'),
      ane : require('./assets/images/pin_horse.png'),
      poney: require('./assets/images/pin_horse.png'),
      dog: require('./assets/images/pin_dog.png'),
      cat: require('./assets/images/pin_cat.png'),
      rabbit: require('./assets/images/pin_rabbit.png'),
      fish: require('./assets/images/pin_fish.png'),
      guinea_pig: require('./assets/images/pin_hamster.png'),
      hamster: require('./assets/images/pin_hamster.png'),
      bird: require('./assets/images/pin_bird.png'),
      bug: require('./assets/images/pin_bug.png'),
      horse: require('./assets/images/pin_horse.png'),
      mouse: require('./assets/images/pin_mouse.png'),
      reptile: require('./assets/images/pin_reptile.png'),
      snake: require('./assets/images/pin_reptile.png'),
      rat: require('./assets/images/pin_mouse.png'),
      chinchilla: require('./assets/images/pin_mouse.png'),
      ferret: require('./assets/images/pin_furet.png'),
      turtle: require('./assets/images/pin_reptile.png'),
      squirrel: require('./assets/images/pin_hamster.png'),
      gerbil: require('./assets/images/pin_mouse.png'),
      gerbille: require('./assets/images/pin_mouse.png'),
      chicken: require('./assets/images/pin_bird.png'),
      spider: require('./assets/images/pin_spider.png'),
      chien: require('./assets/images/pin_dog.png'),
      chat: require('./assets/images/pin_cat.png'),
      lapin: require('./assets/images/pin_rabbit.png'),
      poisson: require('./assets/images/pin_fish.png'),
      cobaye: require('./assets/images/pin_hamster.png'),
      oiseau: require('./assets/images/pin_bird.png'),
      insecte: require('./assets/images/pin_bug.png'),
      cheval: require('./assets/images/pin_horse.png'),
      souris: require('./assets/images/pin_mouse.png'),
      serpent: require('./assets/images/pin_snake.png'),
      tortue: require('./assets/images/pin_turtle.png'),
      furret: require('./assets/images/pin_furet.png'),
      ecureuil: require('./assets/images/pin_hamster.png'),
      poule: require('./assets/images/pin_bird.png'),
      araignée: require('./assets/images/pin_spider.png'),
      vache: require('./assets/images/pin_cow.png'),
      mouton: require('./assets/images/pin_sheep.png'),
      taureau: require('./assets/images/pin_bull.png'),
      cochon: require('./assets/images/pin_pig.png'),
      chevre: require('./assets/images/pin_goat.png'),
      octodon: require('./assets/images/pin_mouse.png'),
      oiseaux: require('./assets/images/pin_bird.png'),
      // Others
      heart: require('./assets/images/pin_heart.png'),
      femelle_off: require('./assets/images/femelle_off.png'),
      femelle_on: require('./assets/images/femelle_on.png'),
      male_off: require('./assets/images/male_off.png'),
      male_on: require('./assets/images/male_on.png'),
      lof: require('./assets/images/lof.png'),
      wantbaby: require('./assets/images/wantbaby.png'),
    }
  },
  Animalgenre_sterilisation: {
    genre: {
      1: require('./assets/images/male_on.png'),
      2: require('./assets/images/femelle_on.png')
    }
  },
  Animalgenre: {
    genre: {
      1: require('./assets/images/male_off.png'),
      2: require('./assets/images/femelle_off.png')
    }
  },
  BreedList: {
    typeofname: {
      gerbille: require('./assets/images/pin_mouse.png'),
      ovin: require('./assets/images/pin_sheep.png'),
      sheep: require('./assets/images/pin_sheep.png'),
      dog: require('./assets/images/pin_dog.png'),
      cat: require('./assets/images/pin_cat.png'),
      rabbit: require('./assets/images/pin_rabbit.png'),
      fish: require('./assets/images/pin_fish.png'),
      guinea_pig: require('./assets/images/pin_hamster.png'),
      hamster: require('./assets/images/pin_hamster.png'),
      bird: require('./assets/images/pin_bird.png'),
      bug: require('./assets/images/pin_bug.png'),
      horse: require('./assets/images/pin_horse.png'),
      mouse: require('./assets/images/pin_mouse.png'),
      reptile: require('./assets/images/pin_reptile.png'),
      snake: require('./assets/images/pin_reptile.png'),
      rat: require('./assets/images/pin_mouse.png'),
      chinchilla: require('./assets/images/pin_mouse.png'),
      ferret: require('./assets/images/pin_furet.png'),
      turtle: require('./assets/images/pin_reptile.png'),
      squirrel: require('./assets/images/pin_hamster.png'),
      gerbil: require('./assets/images/pin_mouse.png'),
      chicken: require('./assets/images/pin_bird.png'),
      spider: require('./assets/images/pin_spider.png'),
      cow: require('./assets/images/pin_cow.png'),
      bull: require('./assets/images/pin_bull.png'),
      pig: require('./assets/images/pin_pig.png'),
      goat: require('./assets/images/pin_goat.png'),
      degus: require('./assets/images/pin_mouse.png'),
      bovins: require('./assets/images/pin_cow.png'),
      cows: require('./assets/images/pin_cow.png'),
      donkey : require('./assets/images/pin_horse.png'),
      ane : require('./assets/images/pin_horse.png'),
      poney: require('./assets/images/pin_horse.png'),
    },
  },
  MyBuddy: {
    version: "1.0.10",
  },
  fetcherror: {
    prbToken: 'Fetch Error : Prb UserToken',
    prbRes: 'Fetch Error : No Res',
    Empty_Fields: 'Empty fields',
    Empty_Field: 'Empty field',

  },
  // Video Duration
  video : {
    duration : 20,
  },
  // Wall Loading
  skipNumber: {
    skipNumber: 10
  },
  // Love
  loveSwap: {
    maxSearchDistance: 1000,
  },

  MenuTxtSize: function (ScreenWidth: number) {
    var textSize = 15;
    if (ScreenWidth > 413) {
      textSize = 15;
    };
    return textSize;
  },

  HeaderTitleSize: function (ScreenWidth: number) {
    var textSize = 14;
    if (ScreenWidth > 300) {
      textSize = 15;
    };
    return textSize;
  },

  validate(text: string | any[], type: string) {
    var err = 0;
    var errors = [];
    var alpha = /^[ a-zA-Z]+$/
    var alpho = /(?=.{8,})/

    if (type == 'username') {
      var textlength = text.length;
      if (!alpha.test(text)) {
        console.log(text, textlength);
        this.setState({ usernameValidate: false })
        err++;
      } else {
        // Erreur si moins de 3 lettres
        if (textlength < 3) {
          this.setState({ usernameValidate: false })
          err++;
        } else {
          this.setState({ usernameValidate: true })
          this.state.username = text;
          this.state.textlength = textlength;
        }
      }
    };
    if (type == 'password') {
      var passlength = text.length;
      if (alpho.test(text)) {
        console.log(text, passlength);
        this.setState({ passwordValidate: false })
        err++;
      } else {
        // Erreur si moins de 4 lettres
        if (passlength < 4) {
          this.setState({ passwordValidate: false })
          err++;
        } else {
          this.setState({ passwordValidate: true })
          this.state.password = text;
          this.state.passlength = passlength;
        }
      }
    };
    this.state.err = err;
  },

};