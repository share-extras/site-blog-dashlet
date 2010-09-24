function sortByCreationDate(post1, post2)
{
   return (post1.name > post2.name) ? -1 : (post1.name < post2.name) ? 1 : 0;
}

function main()
{
   var site, container, theUrl, connector, result, posts;
   
   site = page.url.templateArgs.site;
   container = 'blog';
   theUrl = '/api/blog/site/' + site + '/' + container + '/posts?pageSize=10';
   connector = remote.connect("alfresco");
   result = connector.get(theUrl);
   if (result.status == 200)
   {
      response = eval('(' + result.response + ')');
      posts = response.items;
      //posts.sort(sortByCreationDate);
      model.posts = posts;
      model.create = response.metadata.blogPermissions.create;
      model.numPosts = response.itemCount;
      model.container = container;
   }
}

main();