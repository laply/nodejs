var load = null;
var write = null;
var modify = null;
var del = null;


$(document).ready(function(){
    load = function(){
        $.get('/load', function(data){
            $('#memo').empty();

            $(data).each(function(i) { // for loop 을 돌면서 메모 출력 
                var id = this._id;
                $("#memo").prepend("<div class='item'></div>");
                $("#memo .item:first").append("<div class='photo_thumb'></div>");
                $("#memo .item:first").append(
                    "<div class='author'><b>"+ this.author + "</b> (" + this.data +") &nbsp; &nbsp;" +
                    "<span class='text_button modify'> MODIFY </span> |" +
                    "<span class='text_button del'> DELETE </span>");
                $("#memo .item:first").append("<div class='contents " + id + "'>" +this.contents + "</div>");

                var cnt = 0;

                $("#memo .item:first .modify").click(function(evt){
                    var contents = $("#memo ." + id).html();
                    if(cnt == 0){
                        $("#memo ." + id).html("<textarea id='textarea_" + id +
                         "'class='textarea_modify'>" + contents + "</textarea>");
                        cnt = 1;
                    }

                    $("#textarea_" + id).keypress(function(evt){
                        if((evt.keyCode || evt.which) == 13){
                            if(this.value != ""){
                                modify(this.value, id);
                                evt.preventDefalut();
                            }
                        }
                    });
                });

                $("#memo .item:first .del").click(function(evt){
                    del(id);
                });

                
                
            });
        });
    };
    modify = function(contents, id){
        var postdata ={
            'author': $("#author").val(),
            'contents': contents,
            '_id':id
        }
        $.post('/modify', postdata, function(){
            load();
        });
    };

    write = function(contents){
        var postdata = {
            'author': $("#author").val(),
            'contents': contents,
        };
        $.post('/write', postdata, function(){
            load();
        });
    };

    del = function(id){
        console.log(id);
        var postdata = {
            '_id': id,
        };
        $.post('/del', postdata, function(){
            load();
        });
    };

    $("#write textarea").keypress(function(evt){
        if((evt.keyCode || evt.which) == 13){
            if (this.value != ""){
                write(this.value);
                evt.preventDefalut();
                $(this).val("");
            }
        }
    });

    $("#write_button").click(function(evt){
        console.log($("#write textarea").val());
        write($("#write textarea").val());
        $("#write textarea").val();
    });

    load();
});