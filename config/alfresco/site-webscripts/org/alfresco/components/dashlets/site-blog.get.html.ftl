<script type="text/javascript">//<![CDATA[
   new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");
//]]></script>

<#assign site=page.url.templateArgs.site>

<div class="dashlet site-blog-posts">
   <div class="title">${msg("header.siteBlog")}</div>
   <#if create?? && create?string == "true">
      <div class="toolbar">
         <a id="${args.htmlid}-createLink-button" class="theme-color-1" title="${msg('list.createLink')}" href="${url.context}/page/site/${site}/blog-postedit">${msg("list.createLink")}</a>
      </div>
   </#if>
   <div class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
<#if numPosts?? && numPosts!=0>
   <#list posts as post>
      <#assign postedBy><a href="${url.context}/page/user/${post.author.username?url}/profile" class="theme-color-1">${post.author.firstName?html} ${post.author.lastName?html}</a></#assign>
      <div id="${args.htmlid}-list-div-${post.name}" class="detail-list-item <#if post_index = 0>first-item<#elseif !post_has_next>last-item</#if>">
         <h4><a id="${args.htmlid}-details-span-${post_index}" href="${url.context}/page/site/${site}/blog-postview?container=${container}&postId=${post.name?html}" class="theme-color-1 blog-post-title" title="${(post.title!"")?html}">${(post.title!"")?html}</a></h4>
         <div class="post-details">${msg("text.posted-by", postedBy)} ${msg("text.modified-on", post.createdOn?datetime("MMM dd yyyy HH:mm:ss 'GMT'Z '('zzz')'")?string("d MMM, yyyy HH:mm:ss"))}</div>
         <div class="description"><#if post.content?length &gt; 100>${(post.content)?substring(0, 100)?replace('</*\\w*>', '', 'r')} ...<#else>${post.content?replace('</*\\w*>', '', 'r')}</#if></div>
      </div>
   </#list>
<#else>
      <div class="detail-list-item first-item last-item">
         <span>${msg("label.noPosts")}</span>
      </div>
</#if>
   </div>
</div>