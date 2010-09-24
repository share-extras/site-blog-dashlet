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
          * The component id.
          *
          * @property componentId
          * @type string
          */
         componentId: "",

         /**
          * ID of the current site
          * 
          * @property siteId
          * @type string
          * @default ""
          */
         siteId: ""
      },

      /**
       * Fired by YUI when parent element is available for scripting
       * @method onReady
       */
      onReady: function SiteBlog_onReady()
      {
         Event.addListener(this.id + "-createPost-link", "click", this.onCreatePostClick, this, true);
      },
      
      onCreatePostClick: function SiteBlog_onCreatePostClick()
      {
         return this.selectedValue;
      },

      /**
       * Main entrypoint to show the dialog
       *
       * @method show
       */
      show: function AmSD_show()
      {
         if (this.dialog)
         {
            this._showDialog();
         }
         else
         {
            var data =
            {
               htmlid: this.id
            };
            if (this.options.templateRequestParams)
            {
                data = YAHOO.lang.merge(this.options.templateRequestParams, data);
            }
            Alfresco.util.Ajax.request(
            {
               url: this.options.templateUrl,
               dataObj:data,
               successCallback:
               {
                  fn: this.onTemplateLoaded,
                  scope: this
               },
               failureMessage: "Could not load dialog template from '" + this.options.templateUrl + "'.",
               scope: this,
               execScripts: true
            });
         }
         return this;
      },
      
      /**
       * Event callback when dialog template has been loaded
       *
       * @method onTemplateLoaded
       * @param response {object} Server response from load template XHR request
       */
      onTemplateLoaded: function AmSD_onTemplateLoaded(response)
      {
         // Inject the template from the XHR request into a new DIV element
         var containerDiv = document.createElement("div");
         containerDiv.innerHTML = response.serverResponse.responseText;

         // The panel is created from the HTML returned in the XHR request, not the container
         var dialogDiv = Dom.getFirstChild(containerDiv);
         while (dialogDiv && dialogDiv.tagName.toLowerCase() != "div")
         {
            dialogDiv = Dom.getNextSibling(dialogDiv);
         }

         // Create and render the YUI dialog
         this.dialog = Alfresco.util.createYUIPanel(dialogDiv,
         {
            width: this.options.width
         });

         // Are we controlling a Forms Service-supplied form?
         if (Dom.get(this.id + "-form-submit"))
         {
            this.isFormOwner = false;
            // FormUI component will initialise form, so we'll continue processing later
            this.formsServiceDeferred.fulfil("onTemplateLoaded");
         }
         else
         {
            // OK button needs to be "submit" type
            this.widgets.okButton = Alfresco.util.createYUIButton(this, "ok", null,
            {
               type: "submit"
            });

            // Cancel button
            this.widgets.cancelButton = Alfresco.util.createYUIButton(this, "cancel", this.onCancel);

            // Form definition
            this.isFormOwner = true;
            this.form = new Alfresco.forms.Form(this.id + "-form");
            this.form.setSubmitElements(this.widgets.okButton);
            this.form.setAJAXSubmit(true,
            {
               successCallback:
               {
                  fn: this.onSuccess,
                  scope: this
               },
               failureCallback:
               {
                  fn: this.onFailure,
                  scope: this
               }
            });
            this.form.setSubmitAsJSON(true);
            this.form.setShowSubmitStateDynamically(true, false);

            // Initialise the form
            this.form.init();

            this._showDialog();
         }
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
         var actionUrl = Alfresco.constants.URL_SERVICECONTEXT + "modules/blog/post/" + encodeURIComponent(this.options.siteId);
         
         Event.stopEvent(e);
         
         if (!this.configDialog)
         {
            this.configDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog").setOptions(
            {
               width: "50em",
               templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/blog/post/" + encodeURIComponent(this.options.siteId),
               actionUrl: actionUrl,
               onSuccess:
               {
                  fn: function SiteBlog_onConfigPoll_callback(e)
                  {
                  },
                  scope: this
               },
               doSetupFormsValidation:
               {
                  fn: function SiteBlog_doSetupForm_callback(form)
                  {
                  /*
                        new Alfresco.BlogPostCreate(this.id).setOptions(
                        {
                           siteId: this.options.siteId,
                           editorConfig : 
                           {
                              inline_styles: false,
                              convert_fonts_to_spans: false,
                              theme:'advanced',
                              theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect,forecolor",         
                              theme_advanced_buttons2 :"bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,removeformat",
                              theme_advanced_toolbar_location : "top",
                              theme_advanced_toolbar_align : "left",
                              theme_advanced_statusbar_location : "bottom",
                              theme_advanced_path  : false,
                              theme_advanced_resizing : true,
                              theme_advanced_buttons3 : null,
                              language:'${locale?substring(0, 2)}'         
                           },
                           containerId: "blog",
                           editMode: false
                        }).setMessages(
                              Alfresco.messages.scope[this.name]
                        );
                        */
                     this.dialog = Alfresco.util.createYUIPanel(dialogDiv,
                     {
                        width: "30em"
                     });
                  },
                  scope: this
               }
            });
         }
         else
         {
            this.configDialog.setOptions(
            {
               actionUrl: actionUrl
            });
         }
         
         this.configDialog.show();
      }
   });
})();
