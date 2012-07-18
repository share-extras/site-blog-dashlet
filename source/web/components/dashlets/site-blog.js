/**
 * Copyright (C) 2005-2009 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing
 */
 
/**
 * Dashboard blog component.
 * 
 * @namespace Alfresco
 * @class Alfresco.dashlet.SiteBlog
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
      $combine = Alfresco.util.combinePaths;

   /**
    * Preferences
    */
   var PREFERENCES_DASHLET = "org.alfresco.share.dashlet",
      PREF_SITE_TAGS_FILTER = PREFERENCES_DASHLET + ".SiteBlogFilter";


   /**
    * Dashboard SiteBlog constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.SiteBlog} The new component instance
    * @constructor
    */
   Alfresco.dashlet.SiteBlog = function SiteBlog_constructor(htmlId)
   {
      return Alfresco.dashlet.SiteBlog.superclass.constructor.call(this, "Alfresco.dashlet.SiteBlog", htmlId);
   };

   /**
    * Extend from Alfresco.component.Base and add class implementation
    */
   YAHOO.extend(Alfresco.dashlet.SiteBlog, Alfresco.component.Base,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * ID of the current site
          * 
          * @property siteId
          * @type string
          * @default ""
          */
         siteId: "",

         /**
          * Create Post dialogue editor config
          * 
          * @property postDialogEditorConfig
          * @type object
          */
         postDialogEditorConfig : 
         {
            inline_styles: false,
            convert_fonts_to_spans: false,
            theme:'advanced',
            theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,forecolor",         
            theme_advanced_buttons2 :"bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,removeformat",
            theme_advanced_toolbar_location : "top",
            theme_advanced_toolbar_align : "left",
            theme_advanced_statusbar_location : "bottom",
            theme_advanced_path  : false,
            theme_advanced_resizing : true,
            theme_advanced_buttons3 : null,
            language:'en'
         }
      },
      
      /**
       * Body DOM container.
       * 
       * @property bodyContainer
       * @type object
       */
      bodyContainer: null,
      
      /**
       * Create post modal dialog
       * 
       * @property postDialog
       * @type Alfresco.module.SimpleDialog
       */
      postDialog: null,

      /**
       * Fired by YUI when parent element is available for scripting
       * 
       * @method onReady
       */
      onReady: function SiteBlog_onReady()
      {
         // The body container
         this.bodyContainer = Dom.get(this.id + "-body");
         
         Event.addListener(this.id + "-createPost-link", "click", this.onCreatePostClick, this, true);
         this.loadPosts();
      },

      /**
       * Load latest blog posts and render into the dashlet
       * 
       * @method loadPosts
       */
      loadPosts: function SiteBlog_loadPosts()
      {
         // Load the user timeline
         Alfresco.util.Ajax.request(
         {
            url: Alfresco.constants.PROXY_URI + "api/blog/site/" + this.options.siteId + "/blog/posts?pageSize=10",
            successCallback:
            {
               fn: this.onPostsLoaded,
               scope: this
            },
            failureCallback:
            {
               fn: this.onPostsLoadFailed,
               scope: this
            },
            scope: this,
            noReloadOnAuthFailure: true
         });
      },
      
      /**
       * Posts loaded successfully
       * 
       * @method onPostsLoaded
       * @param p_response {object} Response object from request
       */
      onPostsLoaded: function SitePoll_onPostsLoaded(p_response)
      {
         var posts = p_response.json.items;
         //posts.sort(sortByCreationDate);
         var create = p_response.json.metadata.blogPermissions.create;
         var numPosts = p_response.json.itemCount;
         var el, post, title, postContent, html;
         
         if (numPosts > 0)
         {
            // Remove any existing content
            this.bodyContainer.innerHTML = "";
            
            for ( var i = 0; i < posts.length; i++)
            {
               html = "\n";
               post = posts[i];
               title = post.title ? post.title : "",
               postContent = post.content != "" ? this.stripHTML(post.content).substring(0, 101) : "",
               postedBy = "<a href=\"" + Alfresco.constants.URL_PAGECONTEXT + "user/" + encodeURI(post.author.username) + "/profile\" class=\"theme-color-1\">" + $html(post.author.firstName) + " " + $html(post.author.lastName) + "</a>";
               
               if (postContent.length >= 100)
               {
                  // Trim up to last complete word
                  postContent = postContent.substring(0, postContent.lastIndexOf(" ")) + "...";
               }
               
               el = document.createElement('div');
               Dom.addClass(el, "detail-list-item");
               if (i == 0)
               {
                  Dom.addClass(el, "first-item");
               }
               if (i == posts.length - 1)
               {
                  Dom.addClass(el, "last-item");
               }
               html += "<h4><a href=\"" + Alfresco.constants.URL_PAGECONTEXT + "site/" + this.options.siteId + "/blog-postview?container=blog&postId=" + encodeURI(post.name) + "\" class=\"theme-color-1 blog-post-title\" title=\"" + $html(title) + "\">" + $html(title) + "</a></h4>\n";
               html += "<div class=\"post-details\">" + this.msg("text.posted-by", postedBy) + " " + (Alfresco.util.relativeTime ? Alfresco.util.relativeTime(new Date(post.createdOn)) : this.msg("text.modified-on", Alfresco.util.formatDate(post.createdOn))) + "</div>\n";
               html += "<div class=\"description\">" + postContent + "</div>\n";
               el.innerHTML = html;
               this.bodyContainer.appendChild(el);
            }
         }
         else
         {
            // Create the new div
            var el = document.createElement('div');
            Dom.addClass(el, "detail-list-item");
            Dom.addClass(el, "first-item");
            Dom.addClass(el, "last-item");
            el.innerHTML = "<span>" + this.msg("label.noPosts") + "</span>";
            this.bodyContainer.appendChild(el);
         }
      },
      
      /**
       * Posts load failed
       * 
       * @method onPostsLoadFailed
       * @param p_response {object} Response object from request
       */
      onPostsLoadFailed: function SiteBlog_onPostsLoadFailed(p_response)
      {
      },

      /**
       * Sort blog posts by creation date
       * 
       * @method sortByCreationDate
       * @param post1 {object} Object representing the first blog post
       * @param post2 {object} Object representing the second blog post
       * @return {int} -1 if post1 posted after post2, 1 if posted before, 0 if the same
       */
      sortByCreationDate: function SiteBlog_sortByCreationDate(post1, post2)
      {
         return (post1.name > post2.name) ? -1 : (post1.name < post2.name) ? 1 : 0;
      },

      /**
       * Remove HTML tags from post content, leaving only the text
       * 
       * @method stripHTML
       * @param html {string} Input text containing HTML
       * @return {string} Text with HTML tags stripped out
       */
      stripHTML: function SiteBlog_stripHTML(html)
      {
         // Method from http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
         var tmp = document.createElement("div");
         tmp.innerHTML = html;
         return tmp.textContent||tmp.innerText;
      },

      /**
       * YUI WIDGET EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */
      
      /**
       * Create blog post click handler
       *
       * @method onCreatePostClick
       * @param e {object} HTML event
       */
      onCreatePostClick: function SiteBlog_onCreatePostClick(e)
      {
         var actionUrl = Alfresco.constants.PROXY_URI + "api/blog/site/" + encodeURIComponent(this.options.siteId) + "/blog/posts";
         
         Event.stopEvent(e);
         
         if (!this.postDialog)
         {
            this.postDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog").setOptions(
            {
               width: "50em",
               templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/blog/site/" + encodeURIComponent(this.options.siteId) + "/blog/post",
               actionUrl: actionUrl,
               onSuccess:
               {
                  fn: function SiteBlog_onPostSuccess_callback(p_response, p_obj)
                  {
                     this.loadPosts();
                     var postName = p_response.json.item.name;
                     var postTitle = p_response.json.item.title;
                     if (p_response.json.item.isDraft === true)
                     {
                        Alfresco.util.PopupManager.displayMessage(
                        {
                           text: this.msg("message.savedDraft", postTitle)
                        });
                     }
                     else
                     {
                        Alfresco.util.Ajax.request(
                        {
                           url: Alfresco.constants.PROXY_URI + "api/blog/post/site/" + this.options.siteId + "/blog/" + postName + "/publishing",
                           method: Alfresco.util.Ajax.POST,
                           dataObj: { 
                              action: "publish"
                           },
                           requestContentType: Alfresco.util.Ajax.JSON,
                           responseContentType: Alfresco.util.Ajax.JSON,
                           successMessage: this.msg("message.posted", postTitle),
                           failureMessage: this.msg("message.postExternalFailure", postTitle),
                           scope: this,
                           noReloadOnAuthFailure: true
                        });
                     }
                     this.postDialog = null;
                  },
                  scope: this
               },
               onFailure:
               {
                  fn: function SiteBlog_onPostFailure_callback(p_response, p_obj)
                  {
                     // Re-enable form buttons
                     this.postDialog.widgets.okButton.set("disabled", false);
                     this.postDialog.widgets.cancelButton.set("disabled", false);
                     this.postDialog.widgets.saveDraftButton.set("disabled", false);
                     Alfresco.util.PopupManager.displayMessage(
                     {
                        text: this.msg("message.postFailure")
                     });
                  },
                  scope: this
               },
               doSetupFormsValidation:
               {
                  fn: function SiteBlog_doSetupForm_callback(form)
                  {
                     // Set up editor
                     if (!this.postDialog.widgets.editor)
                     {
                        this.postDialog.widgets.editor = new Alfresco.util.RichEditor(Alfresco.constants.HTML_EDITOR, this.postDialog.id + "-content", this.options.postDialogEditorConfig);
                        this.postDialog.widgets.editor.addPageUnloadBehaviour(this.msg("message.unsavedChanges.blog"));
                     }
                     this.postDialog.widgets.editor.render();

                     // Add validation to the rich text editor
                     this.postDialog.widgets.validateOnZero = 0;
                     var keyUpIdentifier = (Alfresco.constants.HTML_EDITOR === "YAHOO.widget.SimpleEditor") ? "editorKeyUp" : "onKeyUp";         
                     this.postDialog.widgets.editor.subscribe(keyUpIdentifier, function (e)
                     {
                        this.postDialog.widgets.validateOnZero++;
                        YAHOO.lang.later(500, this.postDialog, this.validateAfterEditorChange);
                     }, this, true);
                     
                     // Title is mandatory
                     this.postDialog.form.addValidation(this.postDialog.id + "-title", Alfresco.forms.validation.mandatory, null, "blur");
                     this.postDialog.form.addValidation(this.postDialog.id + "-title", Alfresco.forms.validation.length,
                     {
                        max: 256,
                        crop: true
                     }, "keyup");
                     
                     // Text is mandatory
                     this.postDialog.form.addValidation(this.postDialog.id + "-content", Alfresco.forms.validation.mandatory, null);

                     // Set up Save Draft button
                     if (!this.postDialog.widgets.saveDraftButton)
                     {
                        this.postDialog.widgets.saveDraftButton = Alfresco.util.createYUIButton(this.postDialog, "save", this.onSaveDraftButtonClick);
                        // Add to list of submit elements for validation
                        this.postDialog.form.addSubmitElement(this.postDialog.widgets.saveDraftButton);
                     }
                     
                     // Add a handler to the Post button - in case the Post Draft button has been clicked previously
                     this.postDialog.widgets.okButton.subscribe("click", this.onOKButtonClick, null, this.postDialog);
                     
                     // initialize the tag library
                     if (!this.postDialog.tagLibrary)
                     {
                        this.postDialog.tagLibrary = new Alfresco.module.TagLibrary(this.postDialog.id);
                        this.postDialog.tagLibrary.setOptions(
                        {
                           siteId: this.options.siteId
                        });
                     }
                     this.postDialog.tagLibrary.initialize(this.postDialog.form);
                  },
                  scope: this
               },
               doBeforeFormSubmit:
               {
                  fn: function SiteBlog_doSetupForm_callback(form)
                  {
                     //Put the HTML back into the text area
                     this.postDialog.widgets.editor.save();
   
                      // disable ui elements
                     this.postDialog.widgets.okButton.set("disabled", true);
                     this.postDialog.widgets.cancelButton.set("disabled", true);
                     this.postDialog.widgets.saveDraftButton.set("disabled", true);
   
                     // update the tags set in the form
                     this.postDialog.tagLibrary.updateForm(this.postDialog.id + "-form", "tags");
                  },
                  scope: this
               }
            });
         }
         else
         {
            this.postDialog.setOptions(
            {
               actionUrl: actionUrl
            });
         }
         
         this.postDialog.show();
      },
      
      /**
       * Handle the save draft button being clicked
       * 
       * @method onSaveDraftButtonClick
       * @param p_args event info
       * @param p_obj The Button instance
       */
      onSaveDraftButtonClick: function SiteBlog_onSaveDraftButtonClick(p_args, p_obj)
      {
         Dom.setAttribute(this.id + "-draft", "value", "true");
         p_obj.submitForm();
      },
      
      /**
       * Handle the OK button being clicked
       * 
       * @method onOKButtonClick
       * @param p_args event info
       * @param p_obj The Button instance
       */
      onOKButtonClick: function SiteBlog_onOKButtonClick(p_args, p_obj)
      {
         Dom.setAttribute(this.id + "-draft", "value", "false");
      },

      /**
       * Called when a key was pressed in the rich text editor.
       * Will trigger form validation after the last key stroke after a seconds pause.
       *
       * @method validateAfterEditorChange
       */
      validateAfterEditorChange: function SiteBlog_validateAfterEditorChange()
      {
         this.widgets.validateOnZero--;
         if (this.widgets.validateOnZero === 0)
         {
            var oldLength = Dom.get(this.id + "-content").value.length;
            this.widgets.editor.save();
            var newLength = Dom.get(this.id + "-content").value.length;
            if ((oldLength === 0 && newLength !== 0) || (oldLength > 0 && newLength === 0))
            {
               this.form.updateSubmitElements();
            }
         }
      }
   });
})();
