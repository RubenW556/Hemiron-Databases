# Notulen

### Week 6

Niels:  
Deze week heb ik de de pipeline gemaakt. Deze installeert nu de npm packeges. en doet een audit, lint, test en build. Het enige waar ik tegen aan liep is het cachen van de npm packages.

Ruben:  
Ik heb een video gekeken over gilab ci en hoe dit werkt, zodat ik het beter begrijp. Ik ga deze week Max op de hoogte brengen van onze opdracht.

Suleymen:  
Ik heb kennis gemaakt met de pipeline en docker-compose. Ik wil vandaag gaan kijken hoe de pipeline werkt. En ik heb met Niels megedacht aan de werking van de pipeline.

Max:
Vorige week was ik er niet bij maar ik ben benieuwd naar hoe de pipeline werkt. Maar ik zou het fijn vinden als Niels de pipeline deze week uitlegd zodat iedereen die begrijpt.

### 6 oktober

####  Stand-up
Ruben

* Gaat docker workflow uitvoeren
* Gaat Gitflow uitvoeren

Suleymen

* Gaat docker workflow uitvoeren
* Gaat Gitflow uitvoeren

Niels

* Gaat pipeline verder uitwerken

Max

* Heeft teamleden geïnstrueerd om Sourcetree en Docker te installeren 
* Gaat inzicht verkrijgen in projectkader
* Gaat in pipeline verdiepen

####  Stand-down
Suleymen

* Heeft pipeline uitleg gekregen van Niels.
* Heeft moeite met deploy van Pipeline
* Gaat informeren voor deploy pipeline

Ruben

* Heeft pipeline uitleg gekregen van Niels.
* Heeft project-kader uitleg gegeven aan Max
* Heeft project gemodelleerd.
* Heeft moeite met Docker workflow
* Gaat Docker verder ontdekken door experimenteren

Niels

* Heeft uitleg gegeven over pipeline
* Heeft aan pipeline gewerkt
* Had moeite met caches, maar heeft dit gemaakt
* Gaat deploy van pipeline verder uitwerken

Max

* Heeft uitleg gekregen over project-kader
* Heeft project gemodelleerd.

### 13 oktober

#### Stand-up
Max
* Heeft SCRUM methodiek geintroduceerd
* Heeft Dockerflow afgemaakt voor backend en frontend
* Gaat docker workflow uitleg gegeven
* Gaat gitflow uitleg gegeven

Ruben

* Gaat brainstormen over projectkader

Suleymen

* Gaat brainstormen over projectkader

Niels

* Gaat pipeline verder uitwerken

#### Stand-down
Niels

* Heeft mee lopen brainstormen over project-kader
* Heeft een poging gedaan om een pipeline video te maken
* Heeft moeite met de deploy stage en loopt tegen falende pipeline aan

Suleymenn

* Heeft mee lopen brainstormen over project-kader

Ruben

* Heeft mee lopen brainstormen over project-kader

Max

* Heeft mee lopen brainstormen over project-kader
* Heeft gewerkt aan deploy pipeline

#### Teamlead
Nadruk cijfer ligt op:
- Kwaliteit code
- Nuttige code
- Volledige code
- Commits/Merging

### 20 oktober

#### Stand-up
Ruben

* Heeft gewerkt aan test fase
* Gaat door met test fase
* Suleymen is ziek

Niels

* Heeft gebrainstormd over pipelinne
* Heeft opzet gemeenschappelijke frontend bekijken
* Gaat meeting houden met billing over samenhang tussen teams
* Gaat ontwikkelstraat opzetten frontend
* Gaat compose files op shared zetten (docker flow)

Max

* Heeft GitLab CI/CD cursus gevolgd
* Heeft nieuwe pipeline gemaakt met pre-check, build, deploy, verify en clean stages
* Heeft documentatie uitgewerkt
* Heeft bug dockerflow opgelost
* Gaat meeting houden met billing over samenhang tussen teams
* Gaat test fase maken pipeline
* Gaat pipeline video maken (begin)

Ruben

* Gaat test fase maken pipeline
* Gaat unhappy flow uitwerken pipeline


#### Stand-down

* Het is vakantie , iedereen heeft afgesproken om na de vakantie door te werken. alles is af/uitgevoerd, volgens planning
* Max zal de pipeline video thuis afmaken en inleveren

### 10 november

#### Stand-up

Suleymen:
- Heeft alles met docker laten runnen.
- Gaat database op docker laten runnen via compose

Ruben:
- Heeft postgres op compose gedraait
- Heeft backend op compose gedraait
- Heeft moeite gehad met connectie maken API en DB. 
- Gaat hier nog een tutorial van bekijken en uitwerken.

Niels:
- Heeft frontend gefixt
- Gaat SWAL implementeren
- Gaat begin maken aan normalisatie database

Max:
- Heeft aan db docker opzet gewerkt
- Gaat dit checken en mergen


#### Stand-down
Niels:
- heeft SWAL geimplementeerd op frontend
- heeft begin endpoint databases gemaakt
- Gaat select maken voor de endpoint

Suleymen:
- Heeft conceptueel model gemaakt/inventarisering db
- Gaat een implementatiemodel maken db
- Gaat vervangende opdracht maken ontwikkelstraat (rollback, sonar of artifact)

Ruben:
- heeft een connectie gemaakt met DB
- Gaat nieuwe user aanmaken realiseren

Max:
- Heeft gewerkt aan docker opzet
- Gaat DB verder uitwerken in compose

#### Afspraken:
- Max heeft nogeens de nadruk op gitflow uitgelegd. Om problemen te voorkomen met conflicten zal iedereen een gitflow hanteren. Deze flow bestaat uit de volgende dingen:
- Iedereen werkt vanuit zijn eigen feature branch. Wanneer een feature klaar is om te mergen, zal eerst de develop branch naar de feature branch gemergt worden. Zo kunnen eventuele conflicten, lokaal opgelost worden. Als er geen conflicten (meer) zijn, wordt er een MR met develop gemaakt. 

### 17 november

#### Stand-up
Suleymen:
- heeft SQL-implementatie script gemaakt
- heeft SQL documentatie gemaakt
- Gaat werken aan vervangende opdracht
- Gaat funtionaliteit aanmaken db user maken

Ruben:
- Heeft connectie DB en backend gemaakt (typeorm)
- Gaat er naar feedback van Max veranderen naar een injectable service

Niels:
- Heeft een db endpoint template in de backend opgezet
- Gaat deze endpint uitwerken
- Gaat deze endpoint in de frontend uitwerken

Max:
- Heeft docker entryfile script template gemaakt
- Gaat deze afmaken naar implementatiemodel

#### Stand-down
Niels:
- Heeft een mock db lijst in de endpoint gemaakt
- Laat dit ook zien in de frontend
- Gaat dit veranderen naar data uit een database
Max:
- Heeft gewerkt aan implementatie db schema
- Heeft aan typeorm module gewerkt .
- Gaat users in backend uitwerken.

Ruben:
- heeft aan typeorm module gewerkt en deze uitgewerkt.
- Gaat conflicten oplossen en mergen.

Suleymen:
- Heeft sonar kunnen runnen op de lokale omgeving.
- Gaat sonar implementeren op de pipeline
- 
#### Afspraken

- Billing zal een eigen API beschikbaar stellen, die wij moeten aanspreken.



### 24 november

#### Stand-up
Niels:
- heeft feedback gekregen op MR
- heeft feedback uitgewerkt
- gaat data weergeven uit DB ipv mock data

Max:
- Heeft gewerkt aan docker presentatie

Ruben:
- heeft gewerkt aan typeORM
- Gaat review uitwerken met response van endpoint

Suleymen:
- heeft gewerkt aan sonarqube
- Heeft moeite met implementeren in pipeline/docker
- Gaat sonar scan laten uitvoeren
#### Stand-down

Niels:
- heeft aan de DB endpoint gewerkt.
- gaat response template uitwerken
Suleymen:
- heeft gewerkt aan sonar
- Gaat ontwerp DB refacotern met een enum
Max:
- heeft een docker bug opgelost
- gaat presentatie bespreken

Ruben:
- heeft userscontroller uitgewerkt
- met parameters en uitschrijven naar DB
- Gaat MR review uitwerken
#### Afspraken
- Nogmaal is de gitflow besprken na incident dat Niels zelf ging mergen en de lock eraf had gehaald.
- API zal bij resources de volgende response geven:
```js
{ 
    count: number,
    users: [],
    request: {}
}
```
- API endpoint zal een service bezitten die data opvraagt
- API endpoint zal van een OTD gebruik maken om de parameters te definieren.