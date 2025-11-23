# Azure Cosmos DB

## [Basic Queries](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/quickstart-portal)

Each script is connected to a container. Hence, to query all items in a container: `SELECT * FROM c` where `c` is the container of the current connection.

Every query should not end with a semicolon (`;`).

```sql
SELECT
  VALUE {
    "name": CONCAT(employee.name.first, " ", employee.name.last),
    "department": employee.department.name,
    "email": employee.email
  }
FROM
  employee
WHERE
  STRINGEQUALS(employee.department.name, "Information Technology", true)
```

If you add a semicolon, you'll get the following error.

```
Message: {"errors":[{"severity":"Error","location":{"start":282,"end":283},"code":"SC1010","message":"Syntax error, invalid token ';'."}]}
ActivityId: 71fe4990-2f4a-405c-854f-7947243c7bd0, Microsoft.Azure.Documents.Common/2.14.0
```

Note that unlike the more usual relational databases, the container name must be specified on the `SELECT` and `WHERE` clauses.

An alternative form of the query is presented below, both will return the exact same output.

```sql
SELECT
  CONCAT(employee.name.first, " ", employee.name.last) AS name,
  employee.department.name AS department,
  employee.email
FROM
  employee
WHERE
  employee.department.name = "Information Technology"
```

The `VALUE` clause is only required when working with [computed properties](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/query/computed-properties?tabs=dotnet).

The `STRINGEQUALS` system function is useful if you want to ignore the casing which is passed as the third argument.

## [More Examples](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/tutorial-query)

Insert the following sample item.

```json
{
  "id": "DeOcampoFamily",
  "parents": [
    {
      "firstName": "Teresita",
      "lastName": "De Ocampo"
    },
    {
      "firstName": "Rizaldy",
      "lastName": "De Ocampo"
    }
  ],
  "children": [
    {
      "firstName": "Faye",
      "lastName": "De Ocampo",
      "gender": "female"
    },
    {
      "firstName": "Ralph",
      "lastName": "De Ocampo",
      "gender": "male",
      "pets": ["Athena"]
    },
    {
      "firstName": "Teriz",
      "lastName": "De Ocampo",
      "gender": "female",
      "pets": ["Torchic"]
    }
  ],
  "address": {
    "province": "Cavite",
    "city": "Naic"
  },
  "isRegistered": false
}
```

The following query will result in `[{}]` because you have to specify the index.

```sql
SELECT
  family.children.firstName
FROM
  family
WHERE
  family.id = "DeOcampoFamily"
```

If you'd like to unnest `children`, you'll have use a `JOIN`.

```sql
SELECT
  children.firstName
FROM
  family
JOIN
  children IN family.children
WHERE
  family.id = "DeOcampoFamily"
```

Microsoft calls this as _"Selecting a cross-product of a child collection field."_ If we think about cross joins, the result is going to be a cartesian product. However, unlike PostgreSQL, it's bounded to one item at a time — not across all items — so you never get a global LxR explosion. It's _cross-product_ within each item, not across the entire container.

That is family x children = 1 x 3 = 3. Hence, the produced rows are `[ (f, Faye), (f, Ralph), (f, Teriz) ]`. This is closer to PostgreSQL's concept of `unnest` rather than cross joins.

### Exploration

1. You can no longer use `SELECT *` on joins. The following would throw `SELECT *' is only valid with a single input set.`

```sql
SELECT
  *
FROM
  family
JOIN
  children IN family.children
WHERE
  family.id = "DeOcampoFamily"
```

2. `SELECT c.*` is invalid. The following would throw `Syntax error, incorrect syntax near '*'.`

```sql
SELECT
  children.*
FROM
  family
JOIN
  children IN family.children
WHERE
  family.id = "DeOcampoFamily"
```

3. You can just use brackets instead of `VALUE`, but it will wrap the result in `$1`.

```sql
SELECT
  {
    "f": children.firstName
  }
FROM
  family
JOIN
  children IN family.children
```

```json
[
  {
    "$1": {
      "f": "Faye"
    }
  },
  {
    "$1": {
      "f": "Ralph"
    }
  },
  {
    "$1": {
      "f": "Teriz"
    }
  }
]
```

4. You can just use brackets with alias instead of `VALUE`, but it will wrap each item.

```sql
SELECT
  {
    "name": children.firstName
  } AS child
FROM
  family
JOIN
  children IN family.children
```

```json
[
  {
    "child": {
      "name": "Faye"
    }
  },
  {
    "child": {
      "name": "Ralph"
    }
  },
  {
    "child": {
      "name": "Teriz"
    }
  }
]
```

## [Choosing the Right Partition Key](https://learn.microsoft.com/en-us/azure/cosmos-db/partitioning-overview#choose-a-partition-key)

Refer to the previous example of a `family` container. Cosmos DB automatically partitions data to scale horizontally. Unlike with relational databases, scaling vertically is more common unless database sharding is performed.

The **partition key** decides how items are distributed across those physical partitions.

Each logical partition = items with the same parition key value. The partition key affects the following.

<table>
  <tr>
    <th>Scalability</th>
    <td>Requests on different partition key values can be handled in parallel.</td>
  </tr>
  <tr>
    <th>Performance</th>
    <td>Queries or transactions that stay within one partition are <i>faster and cheaper</i>.</td>
  </tr>
  <tr>
    <th>Storage Balance</th>
    <td>You don't want all data going to the same partition — this is called <i>hot parition</i>.</td>
  </tr>
</table>

### `/id` vs `/address/city` as the Parition Key

#### Option 1: `/id`

- Every item has a unique `id`.
- That means each item will be in its own patitiion.
- So all point reads (e.g. `GetItemById`) are always efficient — you can directly target the parition.

**Pros**

- Perfect for point reads/writes (very common pattern).
- Avoids cross-partition queries.

**Cons**

- Not scalable if you have lots of small unrelated documents — because you lose the benefit of grouping related items together.
- You can't do efficient queries like <i>"get all families in Cavite"</i> since you'd have to query across all partitions.

#### Option 2: `/address/city`

- This group all families from the same city into the same logical partition.

**Pros**

- Efficient if you often query `SELECT * FROM family WHERE family.address.city = "Cavite"` since this stays within one partition.

**Cons**

- **Parition skew risk**: if 80% of the families live in `Cavite`, that single parition becomes _hot_ (heavy load and storage).
- **Less efficient for point reads**: you need to know both the partition key (`city`) and `id` to read an item efficiently.
- Doesn't scale well if the dataset distribution by city is uneven.

### Best Practice Summary

1. Every container must scale by something that gives high cardinality (many unique values).
   1. `/id` → very high cardinality
   2. `/address/city` → low cardinality if you only have a few cities.
2. Be a property that has a value which doesn't change. If a property is your partition key, you can't update that property's value.
3. It should only contain string values.

∴ pick `/id` over `/address/city`.

### [Physical vs Logical Partitions](https://learn.microsoft.com/en-us/azure/cosmos-db/partitioning-overview#logical-partitions)

#### Logical Partitions

There's no limit to the number of logical partitions in a container. Each logical partition can store up to 20 GB of data. Effective partition keys have a wide range of possible values such that it wouldn't grow up to 20 GB.

#### Physical Partitions

Physical partitions are an internal system implementation, and Azure Cosmos DB fully manages them. The number of physical partitions in a container depends on these characteristics.

- The amount of throughput provisioned (each individual physical partition can provide a throughput of up to 10,000 request units per second). The 10,000 RU/s limit for physical partitions implies that logical partitions also have a 10,000 RU/s limit, as each logical partition is only mapped to one physical partition.
- The total data storage (each individual physical partition can store up to 50 GB of data).

## [Point Reads vs. Queries](https://devblogs.microsoft.com/cosmosdb/point-reads-versus-queries/)

There are two ways to read data in Azure Cosmos DB: point reads and queries. Most developers know that you can query data using Cosmos DB's query language, but not everyone realizes that point reads are an even more efficient way to read data.

A **point read** is a key/value lookup on a single item ID and partition key.

<table>
  <tr>
    <th></th>
    <th>Point Read</th>
    <th>Query</th>
  </tr>
  <tr>
    <th>Latency</th>
    <td>Typically less than 10ms</td>
    <td>Variable</td>
  </tr>
  <tr>
    <th>Cost</th>
    <td>1 RU</td>
    <td>At least 2.3 RUs, variable</td>
  </tr>
  <tr>
    <th>No. of Items Returned</th>
    <td>1 Item</td>
    <td>Unlimited</td>
  </tr>
  <tr>
    <th>Partition Key</th>
    <td>Required</td>
    <td>Recommended</td>
  </tr>
</table>

If you just need to read a single item, point reads are cheaper and faster than queries. Point reads can read the data directly and don't require the query engine.
