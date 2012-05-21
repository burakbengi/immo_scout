/**
 * jQuery.fn.sortElements
 * --------------
 * @param Function comparator:
 *   Exactly the same behaviour as [1,2,3].sort(comparator)
 *   
 * @param Function getSortable
 *   A function that should return the element that is
 *   to be sorted. The comparator will run on the
 *   current collection, but you may want the actual
 *   resulting sort to occur on a parent or another
 *   associated element.
 *   
 *   E.g. $('td').sortElements(comparator, function(){
 *      return this.parentNode; 
 *   })
 *   
 *   The <td>'s parent (<tr>) will be sorted instead
 *   of the <td> itself.
 */
jQuery.fn.sortElements = (function(){
 
    var sort = [].sort;
 
    return function(comparator, getSortable) {
 
        getSortable = getSortable || function(){return this;};
 
        var placements = this.map(function(){
 
            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,
 
                // Since the element itself will change position, we have
                // to have some way of storing its original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );
 
            return function() {
 
                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }
 
                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);
 
            };
 
        });
 
        return sort.call(this, comparator).each(function(i){
            placements[i].call(getSortable.call(this));
        });
 
    };
 
})();

// get kaltmiete elements
var kaltmiete = $(".is24-c:odd");

// add miete per m2 in list
// add m2 price in titles to use in further calc.
$(kaltmiete).each(function(){
				  var sogukfiyat = /(\d+)/.exec($(this).text())[1];
				  var m2 = /(\d+)/.exec($(this).next().next().text())[1];
				  var m2fiyat = sogukfiyat/m2;
				  $(this).parent().append('<dt class="m2-header">m² Miete:</dt><dd class="m2-entry" title="' + m2fiyat + '">' + m2fiyat.toString().substring(0,4) + ' EUR</dd>');
				  });

// get m2 miete elements
var m2Head = $('.m2-header'),
	inverse = false;

// sort list for m2 price
m2Head.click(function(){
	m2Head.sortElements(function(a, b){
			return (
				+$(a).next().attr("title") > +$(b).next().attr("title")
				) ? 
					inverse ? -1 : 1 :
					inverse ? 1 : -1;
		}, function(){
			//console.log(this.parentNode.parentNode.parentNode);
			return this.parentNode.parentNode.parentNode;
		});
		
	inverse = !inverse;
	
});
