/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                        VARIABLES
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

var imgPerTheme = [0, 21, 33, 33];
var theme;
var couple;
var retourne;
var jeu = 0;
var compteur;


/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                        UTILISATION
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

creerPlateau();
$("#bAbandonner").attr("disabled", "disabled");


/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                         ECOUTEURS
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

$("#nbColonnes, #nbLignes").change(changeTaille);
$("#theme").change(changeTheme);
$("#bJouer").unbind("click").click(jouer);

/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                        FONCTIONS
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

/* CREATION DU PLATEAU */
function creerPlateau() {
  var code = "";

  var theme =  $("#theme").val();
  for (var i = 0 ; i < 8 ; i++)
  {
    code = code + "<div>";
    for (var j = 0 ; j < 5 ; j++)
    {
      code = code + "<div class='carte c" + i + " l" + j + "'>";
      //ajout de l'image

      //code = code + "<img class='imgCarte verso' src='" + adresseMedia(theme, 1) + "' alt='image carte' height='95px' width='80px'>";
      code = code + "<img src='" + adresseMedia(theme, 0, 0) + "' alt='image dos carte' height='83px' width='70px'>";
      code = code + "</div>";
    }
    code = code + "</div>";
  }
  $("#plateau").html(code);

  changeTaille();
}

/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

/* CREATION DU VECTEUR COUPLE */
function creerVectCouples(imgPerTheme, theme, nbCartes) {
  var pretendant = Math.floor(Math.random()*imgPerTheme[theme])+1;
  var vectCouples = new Array();
  for (var i = 1 ; i <= (nbCartes/2) ; i++)
  {
    while(vectCouples.includes(pretendant))
    {
      pretendant = Math.floor(Math.random()*imgPerTheme[theme])+1;
    }
    vectCouples.push(pretendant, pretendant);
  }
  return vectCouples;
}

/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

/* ATTRIBUTION DES COUPLES */
function attribCouple(imgPerTheme) {
  var theme = $("#theme").val();
  var ligne = $("#nbLignes").val();
  var colonne = $("#nbColonnes").val();

  var nbCartes = ligne * colonne;
  var couples = creerVectCouples(imgPerTheme, theme, nbCartes);
  var couple;
  for (var i = 0 ; i < ligne ; i++)
  {
    for (var j = (8-colonne)/2 ; j < 8-(8-colonne)/2 ; j++)
    {
      couple = trouveCouple(nbCartes, couples);
      $(".c" + j + ".l" + i + " img").addClass("" + couple);
    }
  }
}

/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

/* CALCUL DU COUPLE */
function trouveCouple(nbCartes, couples) {
  var alea = Math.floor(Math.random()*nbCartes);
  while (couples[alea] == 0)
  {
    alea = Math.floor(Math.random()*nbCartes);
  }
  var couple = couples[alea];
  couples[alea] = 0;
  return couple;
}

/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

/* RECHERCHE DE L'ADRESSE DES IMAGES */
function adresseMedia(theme, couple, jeu) {
  // L'image verso dépend du thème et du couple
  // L'image recto ne dépend que du thème
  // Si on cherche l'image verso, on donne theme et couple
  // Si on cherche l'image recto, on donne uniquement theme et couple = 0

  var adresse;
  //recherche de l'adresse de l'image verso
  if (couple != 0)
  {
    adresse = "media/cartes/verso/" + theme + "/" + couple + ".png";
  }
  //recherche de l'adresse de l'image recto
  else {
    if (jeu == 0)
    {
      adresse = "media/cartes/recto/" + theme + "_off.png";
    }
    else {
      adresse = "media/cartes/recto/" + theme + ".png";
    }
  }
  return adresse;
}

/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

/* MODIFICATION DU NOMBRE DE CARTES  */
function changeTaille() {
  var colonne = $("#nbColonnes").val();
  var ligne = $("#nbLignes").val();

  var ind = (8-colonne)/2;

  $(".carte").hide();

  for (var i = ind ; i < 8-ind ; i++)
  {
    $(".c"+i).show();
  }

  for (var j = ligne ; j < 5 ; j++)
  {
      $(".l"+j).hide();
  }

  $("#plateau").css("width", (colonne)*70+(2*colonne)*5 + "px");
}

/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

/* MODIFICATION DU THEME  */
function changeTheme() {
  var theme = $("#theme").val();
  $(".carte img").attr("src", adresseMedia(theme, 0, 0));
}

/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

/* LANCEMENT DU JEU */
function jouer() {
  retourne = 0;

  $("#bJouer").unbind("click");
  $("#bJouer").attr("disabled", "disabled");
  $("#bAbandonner").removeAttr("disabled");

  $("#nbLignes").unbind("change");
  $("#nbLignes").attr("disabled", "disabled");
  $("#nbColonnes").unbind("change");
  $("#nbColonnes").attr("disabled", "disabled");
  $("#theme").unbind("change");
  $("#theme").attr("disabled", "disabled");
  var theme = $("#theme").val();

  chrono();

  $(".carte img").attr("src", adresseMedia(theme, 0, 1));

  attribCouple(imgPerTheme);
  $(".carte img").click(retourneCarte);
}



function retourneCarte() {
  var carte = $(this);
  var theme = $("#theme").val();
  var couple =  carte.attr('class');
  var nbCartes = $("#nbColonnes").val() * $("#nbLignes").val();

  $(".carte img").unbind("click");

  carte.attr("src", adresseMedia(theme, couple));

  if (retourne == couple)
  {
    // 1 point en plus
    $(".carte img." + couple).addClass("found");
    retourne = 0;
    $("#tours").text(parseInt($("#tours").text())+1);
    setTimeout(function(){
      $(".carte img").not($(".found")).click(retourneCarte);
    }, 500);
  }
  else if (retourne != 0){
    var class1 = ".carte img." + couple;
    var class2 = ".carte img." + retourne;
    setTimeout(function(){
      $(class1).attr("src", adresseMedia(theme, 0, 1));
      $(class2).attr("src", adresseMedia(theme, 0, 1));
    }, 800);
    $("#tours").text(parseInt($("#tours").text())+1);
    retourne = 0;
    setTimeout(function(){
      $(".carte img").not($(".found")).click(retourneCarte);
    }, 500);
  }
  else if (retourne == 0) {
    retourne = couple;
    $(".carte img").not($(".found, .retourned")).click(retourneCarte);
    carte.unbind("click");
  }

  if ($(".carte img.found").length == nbCartes) {
    clearInterval(compteur);
    alert("Victoire en " + $("#tours").text() + " tentatives, " + (t2.getMinutes() - t1.getMinutes()) + " min et "+ (t2.getSeconds() - t1.getSeconds()) + " sec.");
  }
}

function abandonner() {
  $("#bJouer").removeAttr("disabled");
  $("#bJouer").unbind("click").click(jouer);
  $("#bAbandonner").unbind("click");
  $("#bAbandonner").attr("disabled", "disabled");

  $("#nbLignes").removeAttr("disabled");
  $("#nbColonnes").removeAttr("disabled");
  $("#nbColonnes, #nbLignes").change(changeTaille);

  $("#theme").removeAttr("disabled");
  $("#theme").change(changeTheme);
  var theme = $("#theme").val();

  $(".carte img").unbind("click");
  $(".carte img").removeClass();
  $(".carte img").attr("src", adresseMedia(theme, 0, 0));

  $("#tours").text(0);
  clearInterval(compteur);
  $("#m, #s, #cs").text("00");
  retourne = 0;
}

function chrono() {
  var t1 = Date.now();
  var tInst;

  var m = 0;
  var s = 0;
  var ms = 0;

  compteur = setInterval(function() {
    tInst = Date.now();
    var dt = (tInst - t1)/10;
    m = Math.floor(dt/6000);
    s = (Math.floor(dt/100))%60;
    cs = Math.floor(dt)%100;

    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }
    if (cs < 10) {
      cs = "0" + cs;
    }

    $("#m").text(m);
    $("#s").text(s);
    $("#cs").text(cs);
  }, 80);
}
