exports.crds_header_footer = (function () {

  var CMS_ENDPOINT = __CMS_ENDPOINT__;

  // TODO: retrieve content block ID's from an external source -- possibly a mapping/config API endpoint
  var CONTENT_BLOCK_IDS = {
    HEADER: 160,
    HEADER_PHOENIX: 550,
    FOOTER: 153
  };

  var ELEMENT_TAGS = {
    HEADER: 'crds-header',
    FOOTER: 'crds-footer'
  };

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  
  function setElementFromContentBlock(targetElementName, blockId) {
    //TODO: check local storage ??

    var source = CMS_ENDPOINT + '/api/ContentBlock?id=' + blockId;
    var client = new XMLHttpRequest();

    client.open('GET', source);
    client.onreadystatechange = function () {

      // console.debug('setElementFromContentBlock statusText: ' + client.statusText);
      if (client.readyState === XMLHttpRequest.DONE && client.status === 200 && client.responseText !== null && client.responseText.length > 0) {

        // console.debug('setElementFromContentBlock was successful retrieving id: ' + blockId);
        var content = JSON.parse(client.responseText).contentBlocks[0].content;
        updateDomElement(targetElementName, content);

      } else if (client.readyState === XMLHttpRequest.DONE && client.status !== 200) {

        console.debug('setElementFromContentBlock was unsuccessful retrieving id: ' + blockId);

      }
    }
    client.send();

  }

  function updateDomElement(elementName, contents) {
    // console.log('updating DOM element ' + elementName);

    var targetElement = document.getElementsByTagName(elementName)[0];
    if (targetElement !== undefined && contents !== undefined && contents !== null && contents.length > 0) {
      targetElement.innerHTML = contents;
    }
  }

  function updateSharedComponents() {
    // console.debug('updating shared components');
    setElementFromContentBlock(ELEMENT_TAGS.HEADER, CONTENT_BLOCK_IDS.HEADER);
    setElementFromContentBlock(ELEMENT_TAGS.FOOTER, CONTENT_BLOCK_IDS.FOOTER);
  }

  var observer = new MutationObserver(function (mutations, observer) {
    // fired when a mutation occurs
    // console.log(mutations, observer);
    updateSharedComponents();
  });

  // define what element should be observed by the observer
  // and what types of mutations trigger the callback
  observer.observe(document, {
    subtree: true,
    attributes: true
    //...
  });

})();