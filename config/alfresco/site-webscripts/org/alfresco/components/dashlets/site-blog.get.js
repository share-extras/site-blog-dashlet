function main()
{
   // Call the repository to see if the user is site manager or not
   var userIsSiteContributor = false,
       json = remote.call("/api/sites/" + page.url.templateArgs.site + "/memberships/" + encodeURIComponent(user.name));
   
   if (json.status == 200)
   {
      var obj = eval('(' + json + ')');
      if (obj)
      {
         userIsSiteContributor = (obj.role == "SiteContributor" || obj.role == "SiteCollaborator" || obj.role == "SiteManager");
      }
   }
   model.userIsSiteContributor = userIsSiteContributor;
}

main();