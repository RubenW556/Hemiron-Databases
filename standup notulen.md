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

### 1 december
#### standup 

Niels

- Ik heb in de frontend de functionaliteit aangemaakt om databases aan te maken en te deleten. Die staat al een weekje op review dus kan gemerged worden. 
- Deze week zal ik alles wat gemaakt hebt om dit werkend te maken moeten updaten omdat de database structuur aangepast is. 
- Ik ga user permissions toevoegen op een database

Ruben

- Ik heb de user controller uitgewerkt. Deze gebruikt nu ook input validatie. Hiervoor heb ik ook gelijk tests geschreven. 
- Deze week ga ik een database aanmaken waar de databases van onze eindgebruikers in komen.

Suleymen

- Ik heb de database aanpassingen doorgevoerd. 
- Daarna heb ik gewerkt aan sonar cube het is gelukt om client werkend te krijgen maar het verbinden van de server en client is nog niet gelukt. 
- Deze week ga ik dit proberen op te lossen

#### standdown

Ruben:
- Heeft Suleymen geholpen met merge issues en docker flow.
- Hotfix bash geregeld in sh file. Dit zit in merge request.
- Gaat merge request specifiek per issue mergen
- Gaat databases per gebruikers aanmaken in backend

Suleymen

- Heeft Sonarscanner service verbinden met de sonarcube server
- Heeft changes voor database doorgevoerd
- Heeft changes ook in database schema z sh file gemaakt
- Gaat login voor sonarscanner invoeren
- Gaat sonarscanner presenteerbaar maken

Max

- Heeft vorige week tot vandaag gewerkt aan opsplitsing van stages, test is nu apart van build
- Heeft implementatie van docker in frontend
- Heeft beide zijn bijna klaar voor mergen
- Gaat docker uitwerken
- Gaat aan verslag werken
- Gaat mogelijk de anderen helpen

Niels
- heeft frontend verplaatst van core naar eigen map
- heeft sql veranderd naar sh
- heeft endpoint gefixt omdat database veranderd was
- Gaat als de review in shared gereviewed is kan ik verder gaan
- Gaat dan kan ik edit maken of iets anders toevoegen
- Gaat Users permissions geven op een database

#### Afspraken:
- Niels Gaat Eigen board beter bijhouden.

### 8 december
#### Standup

Suleymen

- sonarcube af, verbinden lukt nog niet
- gaat oplossen met gene die over sonar gaat. Kan die gene niet bereiken. Gaat op zoek
- heeft merge review niet kunnen bekijken.
- Gaat nu meteen review maken

Ruben
test gefixt
* database e2e mock
* user
* heeft onderzoek
* Heeft request aangepast
* gaat start maken database voor gebruik users aanmaken (backend)
* aangelopen: bij e2e volledige module testen kan niet zonder échte database. Hierom kan dat niet goed getest worden in de pipeline. Misschien test-db op swarm.
* Heeft review goedgekeurd

Niels
* heeft onderzoeksrapport gemaakt
* Gaat begin maken. user permissions endpoint gaan maken database
* heeft board niet bijgehouden
* gaat alsnog board bijhouden
* Heeft reviewer aangepast naar Max

Max

* Heeft onderzoek gemaakt
* reverse-proxy
* Afspreken met Ron hoe dat precies op swarm in gaat stellen
* Is tegenaangelopen met reviews niet uitgevoerd.
* gaat review Ruben nogmaals maken
* gaat review frontend niels maken
* Moet eerst angular bestuderen

#### STANDDOWN

MAX: 

- CRONJOB opstellen voor connectie billing (task-service)

Suleymen:

* Heeft persoon gevonden (Koen) en bericht
* Heeft readme doorgelezen en toegepast (sonar)
* Kan nog niet verbinden omdat sonarqube server eruit ligt (error 500)
* Gaat schema db aanpassen (cascade ).
* lowercase: Gaat nog even de merge reviewen van de aanpassen

Ruben:
* Heeft client databases aanmaaken gemaakt
* Heeft client user implementatie gemaakt
* Heeft client user gekoppeld aan hun db
* Loopt tegenaan Nieuwe gebruikers kunnen alle databases inzien
* Gaat deze bug oplossen door entryfile db aan te passen

Niels:

* heeft backend endpoint gemaakt user owns db (permissie)
* heeft frontend modulair gemaakt. (staat op review)
* Gaat auth implementere in backend met middleware

Max

* Heeft traefik in swarm gemaakt
* Het lukt niet door zerotier gedoe
* Gaat Database in de swarm, maar wacht af tot het echt nodig.
* Gaat inventarisering maken voor connectie met billing


#### Afspraken:

* Bij review iemand kiezen uit groep -> afpsraak. -> gratis koffie
* Bij review niet goed : maak draft
* Bij review reactie: klik resolved

### 15 december
#### standup


Suleymen:

* Heeft contact met koen gevonden
* Manager was down want node-2 was down
* Gaat nu connectie maken sonarqube
* Heeft cascade getest en gemaakt en gerieviewed
* Gaat nog modelleren over database
* Gaat readme/docu maken voor database opzet
* (Gaat trigger database maken user verwijderen kijkt of hij de db ownt of niet zo ja)
* Wilt ook nog iets in de backend gaan maken, even kijken wat

Ruben:
* Niet gelukt bug op te lossen
* Heeft test-branch verwerkt
* Heeft database feedback verwerkt voor request.
* Gaat bug fixen
* Gaat onderzoek doen naar performance queries en deze uitlezen van database, voor uiteindelijk doorsturen billing.
* Had moeite met traefik en docker compose gaat besprken met Max

Niels:
* Heeft endpoint gemerged
* Gaat modulair mergen
* Heeft auth gemaakt
* Gaat auth proberen in middleware te verwerken.
* Gaat auth implementeren in endpoint databases


Max:

* Heeft gewerkt aan traefik
* Heeft Pipeline shared gemaakt
* Heeft growthbook
* Heeft opzet gedaan connectie maken met billing, periodiek data versturen in api
* Ga subdomein lijst opstellen voor traefik
* Gaat Ron informeren over Docker in Docker
* Liep vast bij tests  analyse in pipeline, want die werken ook op lokaal niet eens
* Wij gaan vanaf vandaag óók dinsdag 4u extra standdown
* Wij gaan ook proberen naast donderdag een extra dag effectief te werken.

#### Reflectie:
- Max vraagt iedereen wat zij vinden van hoe het gaat
- Ruben vind het een beetje langzaam gaan
- Wilt misschien 2e standdown implementeren


#### Integratie Billing
Max heeft besproken met Billing voor aanleveren data. Dit gaat hij aankomende week opzetten. Hier een korte uitwerking


```js
const request = {
uuid: number,
size: number,
queries: number,
uptime: number
}
```
* zo wil billing data aangeleverd krijgen. op endpoint user/databasedata
* Per 3 uur
* Billing zal later headers toevoegen ivm auth


#### Standown:
Ruben:
* Test-fixes gemerged op
* Heeft onderzocht hoe queries berekenen
* Gaat Dit implementeren via nestJS in een service
* Heeft traefik werkend gekregen

Niels:
* Traefik opgelost (port veranderd naar 4200 want auth)
* Base url api toegepast in frontend
* Heeft merge uitgevoerd
* Gaat auth middleware maken en implementeren

Suleymen:
* Heeft sonar up gekregen en kunnen verbinden
* Moet nog even overleggen met koen voor laatste puntjes op de I
* Heeft functie gemaakt database verwijderen als gebruiker wordt verwijderd, moet nog getest worden
* Gaat dit verder uitwerken
* Gaat readme maken db
* Gaat remodelleren db

Max:
* Heeft meeting gehad Billing data aanleveren
* Heeft data verzameld van andere taems om traefik te configureren
* heeft gekeken naar traefik implementatie
* Gaat database size onderzoeken

#### Afspraken
* Wij gaan vanaf vandaag óók dinsdag 4u extra standdown (online)
* Wij gaan ook proberen naast donderdag een extra dag effectief te werken.
* Wij veranderen het volgende in onze aanpak:
- Bij creatie database wordth één user aangemaakt en bijgehouden. Een database kan één user gekoppeld hebben. Een user kan wel meerdere database gekoppeld hebben


### 22 december:
#### STANDUP

Ruben:
* Heeft DAO deels samengevoegd
* Heeft queries per database teruggeven.
* Gaat services samenvoegen met DAO afmaken
* Gaat database seeder opzetten via entrypoint.
* Had moeite met traefik, gaat hier nog naar kijken en opnieuw builden

Suleymen:

* heeft db readme gemaakt en feedback verwerkt
* Heeft onderzoek gedaan sonarqube
* Heeft als het goed is een job voor sonar in pipeline
* Gaat remodelleren db met de rest
* Gaat uptime functionaliteit maken
* Wilt even zerotier weer kijken hoe het werkt

Niels:

* Heeft poging gedaan filter maken
* Gaat dit op een andere manier aanpakken en verder proberen
* Gaat frontend database /of redis aanmaken fixen

De volgende subdomeinen zijn opgezet:

* api.hemiron.inf-hsleiden.nl
* database.hemiron.inf-hsleiden.nl
* web.hemiron.inf-hsleiden.nl
* sonarqube.hemiron.inf-hsleiden.nl

Max:

* Heeft gekeken e2e-testing
* Gaat endpoint voor metrics
* Gaat nog even met Ron in overleg over sub
* Gaat billing container in e2e testen

### standown 22/12

Max:

* heeft endpoint gemaatk metrics
* heeft remodel gedaan
* Gaat dit verder gemaakt


Suleymen:
* heeft Readme gemaakt sonarqube
* Heeft remodeling gemaakt

Ruben:

* Heeft remodel gewerkt
* Heeft db query ophalen afgewerkt van postgres
* Heeft test geupdatet
* Gaat db creation afmaken met nieuwe model
* Gaat zorgen dat frontend integratie met postgres client datbase aanmaken

Niels:
* heeft db overzicht toont alleen eigen dbs met delete confirmation
* heeft create database frontend gemaakt.
* Heeft lint fixen geprobeerd
* Heeft remodeeling db gemaakt
* Gaat remodelling verwerken op eigen functionaliteit
* Heeft button gefixt
* gaat info page specifieke database met credists etc 