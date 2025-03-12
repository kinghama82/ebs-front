import { Node } from "@tiptap/core"

const YouTube = Node.create({
    name: 'youtube',
    group: 'block',  // 블록 요소로 설정
    content: 'inline*',
    inline: false,
    draggable: true,
    addAttributes() {
        return {
            src: {
                default: null,
            },
        }
    },
    parseHTML() {
        return [
            {
                tag: 'iframe[src^="https://www.youtube.com/embed/"]',
            },
        ]
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'iframe',
            {
                ...HTMLAttributes,
                width: '100%',
                height: '315',
                frameborder: '0',
                allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
                allowFullScreen: true,
            },
        ]
    },
    addCommands() {
        return {
            setYouTube: (src) => ({ chain }) => {
                return chain().insertContent(`<iframe src="${src}" width="100%" height="315" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>`).run()
            },
        }
    },
})

export default YouTube;