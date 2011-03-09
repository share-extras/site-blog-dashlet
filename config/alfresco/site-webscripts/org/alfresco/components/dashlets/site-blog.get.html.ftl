<script type="text/javascript">//<![CDATA[
   new Alfresco.dashlet.SiteBlog("${args.htmlid}").setOptions(
   {
      "siteId": "${page.url.templateArgs.site!''}"
   }).setMessages(
      ${messages}
   );
   new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");
//]]></script>

<div class="dashlet site-blog-posts">
   <div class="title">${msg("header.siteBlog")}</div>
   <div class="toolbar">
      <a id="${args.htmlid}-createPost-link" class="theme-color-1" title="${msg('list.createLink')}" href="${url.context}/page/site/${page.url.templateArgs.site}/blog-postedit">${msg("list.createLink")}</a>
   </div>
   <div class="body scrollableList" id="${args.htmlid}-body" <#if args.height??>style="height: ${args.height}px;"</#if>>
   </div>
</div>