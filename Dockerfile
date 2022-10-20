FROM httpd AS deploy
LABEL name="devops"
COPY index.html /usr/local/apache2/htdocs/