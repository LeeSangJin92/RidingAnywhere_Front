import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({refData, value,onChange}) => {
    return (
                <ReactQuill
                className='WriteContext'
                value={value}
                ref={refData}
                onChange={onChange}
                theme="snow"
                modules={{
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['code-block'],
                    ['clean']
                ]
            }}
                formats={[
                'header', 'font', 'list', 'bold', 'italic', 'underline', 'code-block', 'color', 'background'
                ]}
            />
    );
};

export default QuillEditor;