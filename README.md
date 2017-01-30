Site Blog Dashlet for Alfresco Share
====================================

Author: Will Abson

This add-on provides a dashlet to display the last ten blog posts and submit new posts from the site dashboard.

![Site Blog Dashlet](screenshots/site-blog-dashlet.png)

The _Create Post_ action provided by the dashlet allows quick and easy creation of new blog posts without leaving the dashboard.

![Create Post Dialogue](screenshots/site-blog-dashlet-create-post.png)

Installation
------------

The dashlet is packaged as a single JAR file for easy installation into Alfresco Share.

To install the dashlet, simply drop the `site-blog-dashlet-<version>.jar` file into the `tomcat/shared/lib` folder within your Alfresco installation, and restart the application server. You might need to create this folder if it does not already exist.

Building from Source
--------------------

This project uses Maven. To build, run `mvn package` which will produce an AMP in the target directory.

Usage
-----

  1. Log in to Alfresco Share and navigate to a site dashboard.
  2. Click the _Customize Dashboard_ button to edit the contents of the dashboard and drag the dashlet into one of the columns from the list of dashlets.
