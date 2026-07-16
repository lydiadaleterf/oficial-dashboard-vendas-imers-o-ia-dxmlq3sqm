migrate(
  (app) => {
    const collection = new Collection({
      name: 'nekt_cache',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'sql_hash', type: 'text', required: true },
        { name: 'response_data', type: 'json', maxSize: 52428800 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_nekt_cache_sql_hash ON nekt_cache (sql_hash)'],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('nekt_cache')
    app.delete(collection)
  },
)
