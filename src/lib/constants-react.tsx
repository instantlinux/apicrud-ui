import { ClearButtons, FormatButtons, LevelSelect, LinkButtons, ListButtons,
         QuoteButtons, RichTextInputToolbar } from 'ra-input-rich-text';

const size = 'medium'

export const toolbarOpts = (
    <RichTextInputToolbar>
        <ClearButtons size={size} />
        <FormatButtons size={size} />
        <LevelSelect size={size} />
        <LinkButtons size={size} />
        <ListButtons size={size} />
        <QuoteButtons size={size} />
    </RichTextInputToolbar>
);

export default toolbarOpts;
