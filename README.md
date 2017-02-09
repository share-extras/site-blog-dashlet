Site Blog Dashlet for Alfresco Share
====================================

This add-on provides a dashlet to display the last ten blog posts and submit new posts from the site dashboard.

![Site Blog Dashlet](screenshots/site-blog-dashlet.png)

The _Create Post_ action provided by the dashlet allows quick and easy creation of new blog posts without leaving the dashboard.

![Create Post Dialogue](screenshots/site-blog-dashlet-create-post.png)

Installation
------------

The dashlet is packaged as a JAR file OR an AMP file for easy installation into Alfresco Share.

To install the JAR, simply drop the `site-blog-dashlet-<version>.jar` file into the `tomcat/shared/lib` folder within your Alfresco installation, and restart the application server. You might need to create this folder if it does not already exist.

To install using the AMP, use the `apply_amps` script that should be provided with Alfresco.

Building from Source
--------------------

This project uses Maven. To build, run `mvn package` which will produce an AMP in the target directory.

If you prefer to deploy to deploy the JAR file rather than an AMP, you can find this in the `target/amp/lib` directory.

Running
-------

You can use Maven to run up an instance of Share with the add-on applied using the `amp-to-war` profile

    mvn clean install -Pamp-to-war

Share will run on port 8081 so just point your browser to http://localhost:8081/share, log in and then follow the *Usage* instructions below.

You must already have an Alfresco repository running locally for Share to connect to, otherwise you will not be able to log in.

Usage
-----

  1. Log in to Alfresco Share and navigate to a site dashboard.
  2. Click the _Customize Dashboard_ button to edit the contents of the dashboard and drag the dashlet into one of the columns from the list of dashlets.
