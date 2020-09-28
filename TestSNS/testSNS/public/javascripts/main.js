var timer = null;
var editing = false;

var load = function(){
    if(!editing){
        $.get('/load', function(data){
            $("#wall").empty();
            $(data).each(function(i){
                var id = this._id;
                $("#wall").prepend(
                    "<div class='item'><divclass='left'></div> <div class='right></div></div>"
                );
                $("#wall .item:first .right").append(
                    "<div class='author'><b>" + this.author + "</b> ("+ this.data + ")$nbsp;&nbsp;" +
                    "<span class='text_button modify'> 수정 </span>" +
                    "<span class='text_button del'> 삭제 </span>" +
                    "<span class='text_button like'> 좋아요 </span>"                    
                    );
                $("#well .item:first .right").append("<div class='contents " +id +"'>"+ this.contents+"</div>");
                
                $("#wall .item:first .comments").append(
                    "<input class='input_comment' type='text />" +
                    "<input class='comment_button' type='button value='COMMENT'/>"      
                );

                id = this._id;

                $("#wall .item:first .input_comment").on("focus", function(){
                    editing = true;
                });

                $("#wall .item:first .input_comment").on("blur", function(){
                    editing = false;
                });
            
                $("#wall .item:first .input_comment").keypress(function(evt){
                    if((evt.keyCode || evt.which == 13 )){
                        if (this.value !== ""){
                            comment(this.value, id);
                            evt.preventDefault();
                            $(this).val("");
                            editing = false;
                        }
                    }
                });

                $("#wall .item:first .commemt_button").click(function(evt){
                    comment($("#wall .item:first .input_comment").val(), id);
                    editing = false;
                });

                var cnt = 0;
                
                $("#wall .item:first .moidfy").click(function(evt){
                    editing = true;
                    if(cnt === 0){
                        var contents = $("#wall . "+ id).html("<textarea id='textarea_" +
                        id + "'class='textearea_modify'>" + contents +"</textarea>");
                        cnt = 1;
                    }

                    $("#textarea_"+id).keypress(function(evt){
                        if((evt.keyCode || evt.which)== 13){
                            if (this.value !== ""){
                                if(this.value !== ""){
                                    modify(this.value, id);
                                    evt.preventDefault();
                                    editing = false;
                                }
                            }
                        }
                    });
                });                
                
                $("#wall .item:first .del").click(function(evt){
                    del(id);
                });

                $("#wall .item:first .like").click(function(evt){
                    editing = false;
                    like(id);
                });

                var write = function(contents){
                    var postdata = {
                        'author' : $("#author").val(),
                        'contents': contents,
                        'picture': $("#message").find(".photo").attr('src'),
                    };

                    $.post('/write', postdata, function(){
                        load();
                    });
                };

                var modify = function(contents, id){
                    var postdata = {
                        'author' : $("#author").val(),
                        'contents' : contents,
                        '_id' :id,
                    };
                    $.post('/modify', postdata, function(){
                        load();
                    });
                };

                var comment = function(comment, id){
                    var postdata ={
                        'author': $("#author").val(),
                        'comment': comment,
                        '_id':id,
                    };
                    $.post('/comment', postdata, function(){
                        load();
                    });
                };

                var del = function(comment, id){
                    var postdata ={
                        '_id':id,
                    };
                    $.post('/del', postdata, function(){
                        load();
                    });
                };                
                
                var like = function(comment, id){
                    var postdata ={
                        '_id':id,
                    };
                    $.post('/like', postdata, function(){
                        load();
                    });
                };
                
                $(document).ready(function(){
                    $("#message textarea").on("focus", function(){
                        editing = true;
                    });
                    $("#message textarea").on("blur", function(){
                        editing = false;
                    });
                    $("#message textarea").keypress(function(){
                        if((evt.keyCode || evt.which == 13 )){
                            if (this.value !== ""){
                                comment(this.value, id);
                                evt.preventDefault();
                                $(this).val("");
                                editing = false;
                            }
                        }
                    });

                    $("#write_button").click(function(evt){
                        console.log($("#message texteara").val());
                        write($("#message textarea").val());
                        $("#message testarea").val("");
                        editing = false;
                    });

                    load();

                    timer = setInterval(load(), 5000);
                });
            });
        });
    }
};