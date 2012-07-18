<div id="${args.htmlid}-configDialog">
   <div class="hd">${msg("label.header")}</div>
   <div class="bd">
      <form id="${args.htmlid}-form" action="" method="POST">
         <div class="yui-gd">
            <div class="yui-u first"><label for="${args.htmlid}-title">${msg("label.title")}:</label></div>
            <div class="yui-u">
               <input class="wide" type="text" name="title" id="${args.htmlid}-title" />
            </div>
         </div>
         <div class="yui-gd">
            <div class="yui-u first"><label for="${args.htmlid}-content">${msg("label.content")}:</label></div>
            <div class="yui-u">
               <textarea rows="8" cols="80" name="content" id="${args.htmlid}-content"></textarea>
            </div>
         </div>
         <div class="yui-gd">
            <div class="yui-u first"><label for="${args.htmlid}-tags">${msg("label.tags")}:</label></div>
            <div class="yui-u">
               <#import "/org/alfresco/modules/taglibrary/taglibrary.lib.ftl" as taglibraryLib/>
               <@taglibraryLib.renderTagLibraryHTML htmlid=args.htmlid />
            </div>
         </div>
         <div class="bdft">
            <input type="submit" id="${args.htmlid}-ok" value="${msg("button.post")}" />
            <input type="submit" id="${args.htmlid}-save" value="${msg("button.saveDraft")}" />
            <input type="button" id="${args.htmlid}-cancel" value="${msg("button.cancel")}" />
         </div>
         <input type="hidden" id="${args.htmlid}-container" name="container" value="${url.templateArgs.componentId}" />
         <input type="hidden" id="${args.htmlid}-draft" name="draft" value="false" />
         <input type="hidden" id="${args.htmlid}-page" name="page" value="blog-postview" />
         <input type="hidden" id="${args.htmlid}-site" name="site" value="${url.templateArgs.siteId}" />
      </form>
   </div>
</div>