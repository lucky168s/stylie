define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus

  ,template

) {
  'use strict';

  var VENDORS = [
    { id: 'mozilla', label: 'Mozilla' }
    ,{ id: 'microsoft', label: 'Microsoft' }
    ,{ id: 'opera', label: 'Opera' }
    ,{ id: 'webkit', label: 'WebKit' }
    ,{ id: 'w3', label: 'W3C' }
  ];

  var CssPanelComponentView = Lateralus.Component.View.extend({
    template: template

    ,events: {
      'submit form': 'onSubmitForm'
      ,'keyup .update-on-keyup': 'onKeyupAutoUpdate'
      ,'change .update-on-change': 'onChangeAutoUpdate'
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);

      this.$w3Checkbox.prop('checked', true);

      this.listenFor('timelineModified', this.onTimelineModified.bind(this));
      this.listenFor('tabShown', this.onTabShown.bind(this));
    }

    ,getTemplateRenderData: function () {
      var renderData = this._super('getTemplateRenderData', arguments);

      _.extend(renderData, {
        vendors: VENDORS
      });

      return renderData;
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onSubmitForm: function (evt) {
      evt.preventDefault();
    }

    ,onKeyupAutoUpdate: function () {
      this.renderCss();
    }

    ,onChangeAutoUpdate: function () {
      this.renderCss();
    }

    ,onTimelineModified: function () {
      if (this.$el.is(':visible')) {
        this.renderCss();
      }
    }

    /**
     * @param {jQuery} $shownContent
     */
    ,onTabShown: function ($shownContent) {
      if ($shownContent.is(this.$el)) {
        this.renderCss();
      }
    }

    ,renderCss: function () {
      var cssOpts = this.lateralus.getCssConfigObject();

      var css = this.lateralus.rekapiComponent.getCssString(cssOpts);
      this.$generatedCss.val(css);
    }

    /**
     * @return {Array.<string>}
     */
    ,getSelectedVendorList: function () {
      var accumulator = [];

      VENDORS.forEach(function (vendor) {
        var id = vendor.id;

        if (this['$' + id + 'Checkbox'].is(':checked')) {
          accumulator.push(id);
        }
      }, this);

      return accumulator;
    }

    /**
     * @return {{
     *   name: string,
     *   fps: number,
     *   vendors: Array.<string>
     * }}
     */
    ,toJSON: function () {
      return {
        name: this.$className.val()
        ,fps: +this.$cssSizeOutput.val()
        ,vendors: this.getSelectedVendorList()
      };
    }
  });

  return CssPanelComponentView;
});