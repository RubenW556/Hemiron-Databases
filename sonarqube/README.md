# README SONARQUBE

## Introduction
### What is SonarQube?
SonarQube is an open-source platform for managing code quality and security. 
It provides static code analysis and code review tools to help developers identify and fix issues in their code, such as bugs, vulnerabilities, and style violations. 
SonarQube can be integrated with a wide range of programming languages and build tools, 
and it provides a web-based dashboard for tracking and managing code quality and security issues.

### How does SonarQube work?
#### Warnings
SonarQube analyzes code and provides four types of warnings:
1. Code smells
2. Bugs
3. Vulnerabilities
4. Security hotspots

These issues are determined based on the following decision tree:
1. Is the issue related to code that is demonstrably wrong or more likely wrong than not? it is a bug.
2. Is the issue related to code that could be exploited by an attacker? it is a vulnerability.
3. Is the issue related to code that is security-sensitive? it is as a hotspot.
4. If none of the above, it is a code smell.

#### Issues
In SonarQube, *issues* are classified into four levels of severity. 
Each level represents a different combination of impact and likelihood;
- Blocker  
- Critical
- Major    
- Minor    
  A Blocker issue is one that is both highly impactful and highly likely to occur, while a Critical issue is highly impactful but less likely to occur. A Major issue is less impactful but still fairly likely to occur, and a Minor issue is both low impact and low likelihood.


| Name     | Impact   | Likelihood   |
|----------|----------|--------------|
| Blocker  | High     | High         |
| Critical | High     | Low          |
| Major    | Low      | High         |
| Minor    | Low      | Low          |

For more information on these severities and how they are used in SonarQube, please visit the following link:
https://docs.sonarcloud.io/digging-deeper/rules/.


1. Dit is de command voor SonarQube server

`docker compose up -d`

2. Ga naar `http://sonar.localhost`

3.  Volg de stappen: Select Create new project.

- Give your project a Project key and a Display name and select Set up.
- Under Provide a token, select Generate a token. Give your token a name, select Generate, and click Continue.
- Select your project's main language under Run analysis on your project, and follow the instructions to analyze your project. Here you'll download and execute a scanner on your code (if you're using Maven or Gradle, the scanner is automatically downloaded)

## Prerequisites - Server 
### Install and set up SonarQube server


## Configuration of Client
For configuring the client you only have to do 3 things;

1. Go to your server; press on create new project>[your_project]> with Gitlab CI. Then get your projectKey.
2. Add a `sonar-project.properties` file to your source directory. Then add to it your projectKey. This will look like the following:

    `sonar.projectKey=2223.ipsenh-p1-p2_databases_AYUWKh25ugoeXqTxPLP1` \
    `sonar.qualitygate.wait=true`
   
3. In your ``.gitlab-ci.yml`` or ``child-pipeline.yml`` file create a new job:
    ```yaml
    CI_SONAR_BACKEND:
      # Not using "<<: *template_main" or "<<: *template_merge" because this is doesnt follow their rules.
      # Not using any template at all because this build isnt repeated anywhere else
      stage: analyse
      image:
        # Get the latest sonar-scanner image. See Sonar Readme for why this is better than a specific version
        # Entrypoint refers to the default script that should be run immediately after image has been pulled
        name: sonarsource/sonar-scanner-cli:latest
        entrypoint: [""]
      variables:
        SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"  # Defines the location of the analysis task cache
        GIT_DEPTH: "0"  # Tells git to fetch all the branches of the project, required by the analysis task
      cache:
        key: "${CI_JOB_NAME}"
        paths:
          - .sonar/cache
      script:
        - sonar-scanner
      allow_failure: true # 
    ```
       **NOTE:** The place where this code is put determines which scope it searches by default


### Only run in certain circumstances
Optionally, configure the SonarQube analysis job to run only on certain branches or for certain file patterns
There are several alternatives to using the allow_failure option in SonarQube, depending on the specific needs and goals of the project. Here are a few options to consider:

Use the `--fail-fast` option: The `--fail-fast` option can be used to instruct SonarQube to stop the analysis as soon as an error is encountered. 
This can help to identify and address issues more quickly, but it may also result in more frequent build failures if there are issues with the codebase.

Use the `--force`  or `--ignore-errors` option: These options can be used to instruct SonarQube to continue the analysis even if there are issues with the codebase. 
This can be useful in cases where it is important to complete the analysis even if there are issues, but it may also result in less accurate analysis results if there are significant issues in the codebase.

### Set or change code directory
SonarQube gives you several options for configuring exactly what will be analyzed.
By default it will run on the directory in which your container is located. It will ignore all files in the .gitignore 

But you can also:
- completely ignore some files or directories
- exclude files/directories from Issues detection (specific rules or all of them) but analyze all other aspects
- exclude files/directories from Duplications detection but analyze all other aspects
- exclude files/directories from Coverage calculations but analyze all other aspects

These changes can be done globally or at a project level, and either in app-settings, ``sonar.properties`` file, or in your ```yaml CI_SONAR_BACKEND: ``` \
At the global level, the navigation path is Administration > General Settings > Analysis Scope. \
At the project level, the navigation path is Project Settings > General Settings > Analysis Scope. 

if in the ``sonar.properties`` file you can change your script to: 
```yaml 
script:
    - sonar-scanner -Dsonar.sources=src
```
with 'src' being your desired directory or filetype.

There is also the ``sonar.exclusions`` and `sonar.inclusions` functionality; for more information about those please go to:
https://sonarqube.inria.fr/sonarqube/documentation/project-administration/narrowing-the-focus/


## Usage
### Security
A security hotspot highlights a security-sensitive piece of code that the developer needs to review. Upon review, you'll either find there is no threat, or you need to apply a fix to secure the code.
You can think of hotspots as an example of defense in depth, where several redundant layers of protection are added to an application to make it more resilient in the event of an attack.

With a vulnerability, a problem that impacts the application's security has been discovered that needs to 
be fixed immediately

#### What to do with a security hotspot?
1. Understand the risk – Understanding when and why you need to apply a fix in order to reduce an information security risk (threats and impacts).
2. Identify protections – While reviewing hotspots, you'll see how to avoid writing code that is at risk, determine which fixes are in place, and determine which fixes still need to be implemented to fix the highlighted code.
3. Identify impacts – With hotspots, you'll learn how to apply fixes to secure your code based on the impact on overall application security. Recommended secure coding practices are included on the hotspots page to assist you during your review.

#### What to do with a vulnerability?
With a vulnerability, a problem that impacts the application's security has been discovered that needs to be fixed immediately.

### Complexity
Complexity (complexity) It is the cyclomatic complexity calculated based on the number of paths through the code. 
Whenever the control flow of a function splits, the complexity counter gets incremented by one. 
Each function has a minimum complexity of 1. 
This calculation varies slightly by language because keywords and functionalities do.

### Duplications
For a block of code to be considered as duplicated:

Non-Java projects:

There should be at least 100 successive and duplicated tokens.
Those tokens should be spread at least on:\
30 lines of code for COBOL\
20 lines of code for ABAP\
10 lines of code for other languages\

**Java projects:** There should be at least 10 successive and duplicated statements whatever the number of tokens and lines. 
Differences in indentation and in string literals are ignored while detecting duplications.

### Maintainability

The Maintainability Rating is a measure of the value of the technical debt ratio for a project. 
It is based on a default rating grid, with the following categories:\
A: 0-0.05\
B: 0.06-0.1\
C: 0.11-0.20\
D: 0.21-0.5\
E: 0.51-1

This rating scale can also be interpreted in terms of the outstanding remediation cost as a percentage of the time already invested in the application. If the outstanding remediation cost is:

Less than or equal to 5%, the rating is A\
Between 6% and 10%, the rating is B\
Between 11% and 20%, the rating is C\
Between 21% and 50%, the rating is D\
Over 50%, the rating is E\
The Maintainability Rating is an important metric for assessing the long-term sustainability and viability of a project. It helps to identify areas where technical debt may be accumulating and provides a way to prioritize remediation efforts.

#### Technical Debt Ratio
Ratio between the cost to develop the software and the cost to fix it. The Technical Debt Ratio formula is:
Remediation cost / Development cost.

Which can be restated as:
Remediation cost / (Cost to develop 1 line of code * Number of lines of code)
The value of the cost to develop a line of code is 0.06 days.

Technical debt is a term used to describe the consequences of taking shortcuts or making design decisions that are expedient in the short term, 
but that may create problems or increase the complexity of a system in the long term. 
Technical debt can be thought of as a metaphor for financial debt: just as financial debt can accumulate over time and become more difficult to pay off as the interest compounds, 
technical debt can also accumulate and become more difficult to address as the complexity of the system increases. 
Technical debt can be caused by a variety of factors, such as the need to meet tight deadlines, the use of outdated technologies or practices, or a lack of resources or expertise. 
It is important to address technical debt in a timely manner, as it can have negative consequences such as increased maintenance costs, reduced system performance, and reduced flexibility to make changes or add new features.

### Reliability

### Test Coverage
#### Condition coverage
On each line of code containing some boolean expressions, the condition coverage simply answers the following question: 'Has each boolean expression been evaluated both to true and false?'. 
This is the density of possible conditions in flow control structures that have been followed during unit tests execution

#### Line coverage
On a given line of code, Line coverage simply answers the following question: Has this line of code been executed during the execution of the unit tests?. It is the density of covered lines by unit tests:


#### Coverage  
It is a mix of line coverage and condition coverage. Its goal is to provide an even more accurate answer to the following question: How much of the source code has been covered by the unit tests?


### Data retention policy

In order to allow tracking of the evolution of a project through time, SonarCloud keeps data on past analyses. However, data is progressively deleted as it gets older. SonarCloud’s data retention policy is outlined below.

After each analysis the following is removed:

The source code of the previous analysis.
Measures at the directory and file levels.
History at the package/directory level.
PR data is retained for four weeks after analysis. Additionally, for each project, snapshots of analyses (main branch, non-main branch, and pull request) are retained or removed according to the following rules:

All snapshots are retained for one day.
After one day, only one snapshot per day is retained.
After one week, only one snapshot per week is retained.
After 4 weeks, only one snapshot for every 4 weeks is retained.
In all the above cases, in addition to the single snapshot retained at each step, any snapshots marked by an event are also retained. See Activity History for information on events.

Continuing on:

After 2 years, only snapshots with version events are retained. Snapshots without events or with only non-version events are deleted.
After 5 years all snapshots are deleted, including snapshots marked by version events.
Separately:

All closed issues more than 30 days old are deleted.
Projects in organizations on a free plan that have not been analyzed for one year are automatically deleted. This also applies to projects that were created one year previously but were never analyzed. Users receive notifications of this event on the SonarCloud project interface four weeks before the deletion will take place.
These settings cannot be customized.
https://docs.sonarcloud.io/digging-deeper/housekeeping/


## Read more:
https://docs.sonarqube.org/