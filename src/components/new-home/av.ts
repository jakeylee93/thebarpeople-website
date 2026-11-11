// Marks AnyVendor's editor uses to find things on the page (bridge v1):
//   data-av-field="<section>.<field>"               the element whose text is that field, or its <img>
//   data-av-field="<section>.<list>.<row>.<field>"  the same, inside a list
// A marked element must hold nothing but that field's text: the editor writes
// unsaved words straight into it. The marks are inert outside the editor.

export const av = (field: string) => ({ 'data-av-field': field });
export const avRow = (list: string, row: number, field: string) => ({ 'data-av-field': `${list}.${row}.${field}` });
