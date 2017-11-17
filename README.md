# Xamk Tilanvaraus
Gitti tälle projektille

Projekti on toteutettu kouluprojektia varten kurssille Sähköisen palvelun suunnittelu ja toteutus.

## Tarvittavat ohjelmistot kehitykseen:

GIT - Versio 2.15.0 tai uudempi

    Ohjeet gitin käyttöön: https://www.atlassian.com/git/tutorials

    Latauslinkki: https://git-scm.com/download/win

Node.JS - Versio 8.9.0 LTS tai uudempi

    NPM - Versio 5.5.1 tai uudempi

    https://nodejs.org/en/

### Vaihtoehtoiset mutta suositeltavat

Visual Studio Code
    
https://code.visualstudio.com/

    Lisäosat siihen:
        Pakolliset:
            Beautify
            Node.js Extension Pack

        Vaihtoehtoiset:
            Auto Close Tag
            IntelliSense for Css Class names
            HTML Snippets
            Angular 1 JavaScript and TypeScript Snippets
            vscode-Icons

## Buildi ja Kehitys

**!HUOM!**
Koulun koneilla on oltava kirjautunut .\Student tunnuksilla

**Aja seuraavat komennot komentorivillä projektin juuressa seuraavassa järjestyksessä**
1. `npm install`

2. _Tämän voi jättää välistä jos tämä on ennen suoritettu      kyseisellä koneella_ `npm install -g grunt-cli bower yo` 

3. `bower install --force`

4. `grunt serve` käynnistää sovelluksen ja laittaa live previewin päälle

5. **!HUOM!** Seuraava komento on tarkoitettu ainoastaan julkaisua varten `grunt` 

Tämän hetkinen toteutus toimii vain paikallisesti, eli koneella pitää olla mongodb asennettuna ja päällä. Nodejs palvelin pitää myös olla päällä (löytyy projektin juuresta komennolla `node main.js`).

### Tekniikat

Käytämme AngularJS, HTML5, CSS3
