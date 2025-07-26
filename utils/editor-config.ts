export const editorConfig = {
    plugins: [
        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image',
        'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks',
        'wordcount', 'code', 'textcolor'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | visualblocks searchreplace codesample code',
    menubar: false,
    height: 400,
    resize: true,
    toolbar_mode: 'sliding',
    branding: false,
    statusbar: true,
    setup: function (editor: any) {
        editor.on('init', function () {
            setTimeout(function () {
                editor.execCommand('mceRepaint');
            }, 300);
        });
    }
};
