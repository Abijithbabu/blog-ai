import { Editor } from "@tinymce/tinymce-react";
import React from "react";
import { useTheme } from "next-themes";

const TextEditor = ({
  data,
  dispatch,
}: {
  data: string;
  dispatch: (content: string) => void;
}) => {
  const { theme } = useTheme();
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      value={data}
      onEditorChange={(content) => {
        dispatch(content);
      }}
      init={{
        height: 550,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | formatselect | " +
          "bold italic backcolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        skin: theme === "dark" ? "oxide-dark" : "oxide",
        content_css: theme === "dark" ? "dark" : "default",
        content_style:
          theme === "dark"
            ? "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #020817; color: #d6d9dd; }"
            : "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #ffffff; color: #000000; }",
        branding: false,
        promotion: false,
        statusbar: true,
        resize: true,
        paste_data_images: true,
        image_advtab: true,
        link_list: [
          { title: "My page 1", value: "https://www.example.com" },
          { title: "My page 2", value: "https://www.example.com" },
        ],
        image_list: [
          { title: "My image 1", value: "https://www.example.com/image1.jpg" },
          { title: "My image 2", value: "https://www.example.com/image2.jpg" },
        ],
        templates: [
          {
            title: "New Table",
            description: "creates a new table",
            content:
              '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
          },
        ],
        template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
        template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
        image_caption: true,
        quickbars_selection_toolbar:
          "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
        contextmenu: "link image table configurepermanentpen",
        powerpaste_word_import: "clean",
        powerpaste_html_import: "clean",
        setup: function (editor) {
          editor.on("init", function () {
            editor.getContainer().style.transition =
              "border-color 0.15s ease-in-out";
            editor.getContainer().style.borderColor =
              theme === "dark" ? "#333333" : "#e5e7eb";
          });
        },
      }}
    />
  );
};

export default TextEditor;
