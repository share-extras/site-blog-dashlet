<@markup id="css" >
    <@link rel="stylesheet" type="text/css" href="${url.context}/res/modules/taglibrary/taglibrary.css" />
    <@link rel="stylesheet" type="text/css" href="${url.context}/res/extras/components/dashlets/site-blog.css" />
</@>

<@markup id="js">
    <#-- JavaScript Dependencies -->
    <@script type="text/javascript" src="${url.context}/res/modules/simple-dialog.js" group="dashlets"></@script>
    <@script type="text/javascript" src="${url.context}/res/modules/editors/tiny_mce/tiny_mce.js" group="dashlets"></@script>
    <@script type="text/javascript" src="${url.context}/res/modules/editors/tiny_mce.js" group="dashlets"></@script>
    <@script type="text/javascript" src="${url.context}/res/modules/taglibrary/taglibrary.js" group="dashlets"></@script>
    <@script type="text/javascript" src="${url.context}/res/extras/components/dashlets/site-blog.js" group="dashlets"></@script>
</@>

<script type="text/javascript">//<![CDATA[
   var dashlet = new Alfresco.dashlet.SiteBlog("${args.htmlid}").setOptions(
   {
      "siteId": "${page.url.templateArgs.site!''}"
   }).setMessages(
      ${messages}
   );
   new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");

   var createPostEvent = new YAHOO.util.CustomEvent("onDashletCreatePost");
   createPostEvent.subscribe(dashlet.onCreatePostClick, dashlet, true);

   new Alfresco.widget.DashletTitleBarActions("${args.htmlid}").setOptions(
   {
      actions:
      [
<#if userIsSiteContributor>
         {
            cssClass: "createPost",
            eventOnClick: createPostEvent,
            tooltip: "${msg("dashlet.createBlogPost.tooltip")?js_string}"
         },
</#if>
         {
            cssClass: "help",
            bubbleOnClick:
            {
               message: "${msg("dashlet.help")?js_string}"
            },
            tooltip: "${msg("dashlet.help.tooltip")?js_string}"
         }
      ]
   });
//]]></script>

<div class="dashlet site-blog-posts">
   <div class="title">${msg("header.siteBlog")}</div>
   <div class="body scrollableList" id="${args.htmlid}-body" <#if args.height??>style="height: ${args.height}px;"</#if>>
   </div>
</div>
