$("#proj-add-button").on("click", function () {

    let link = $('#post-add-link').val();
    let title = $('#post-add-title').val();
    let desc = $('#post-add-desc').val();
    if (!link || !title || !desc) {
        $(".modal-message").html('<div class="alert alert-danger alert-dismissible">\
    <button type="button" class="close" data-dismiss="alert">&times;</button>\
    <strong>Yikes!:</strong> Fields Should not be empty\
  </div>')
        return;
    }
    $.getJSON('/create_post', {
        link: link,
        title: title,
        desc: desc
    }, function (data) {
        if (data) {
            if (data.status == "ok") {
                $('#post-add-link').val("");
                $('#post-add-title').val("");
                $('#post-add-desc').val("");
                $(".modal-message").html('<div class="alert alert-success alert-dismissible">\
                <button type="button" class="close" data-dismiss="alert">&times;</button>\
                <strong>Whooa:</strong> Post Added Successfully\
              </div>')

            }
        }


    })
})

function get_posts(page) {
    $.getJSON('/get_posts', {
        page: page
    }, function (data) {
        $('.post-table').html(data.content)
        $(document).scrollTop(0)
        // console.log("data",data);

    })
}