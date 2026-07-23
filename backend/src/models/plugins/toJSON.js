/**
 * Normalises documents for the wire: `_id` → `id`, drops `__v`, and strips any
 * path flagged `private: true` in the schema.
 */
export function toJSONPlugin(schema) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      ret.id = ret._id?.toString();
      delete ret._id;

      schema.eachPath((path, schemaType) => {
        if (schemaType.options?.private) {
          const segments = path.split('.');
          let cursor = ret;
          for (let i = 0; i < segments.length - 1; i += 1) {
            cursor = cursor?.[segments[i]];
            if (!cursor) return;
          }
          delete cursor[segments.at(-1)];
        }
      });

      return ret;
    },
  });
}

export default toJSONPlugin;
