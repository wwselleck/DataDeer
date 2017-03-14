## Modules

<dl>
<dt><a href="#module_index">index</a></dt>
<dd></dd>
<dt><a href="#module_lib/optionTypes">lib/optionTypes</a></dt>
<dd></dd>
<dt><a href="#module_lib/raft">lib/raft</a></dt>
<dd><p>Main Raft module. This module is directly exported by the index module</p>
</dd>
<dt><a href="#module_lib/raftDataSource">lib/raftDataSource</a></dt>
<dd></dd>
<dt><a href="#module_lib/raftDataStore">lib/raftDataStore</a></dt>
<dd></dd>
</dl>

<a name="module_index"></a>

## index
**See**: module:lib/raft  
<a name="exp_module_index--module.exports"></a>

### module.exports ⏏
A direct export of the lib/raft module

**Kind**: Exported member  
**See**: module:lib/raft  
<a name="module_lib/optionTypes"></a>

## lib/optionTypes

* [lib/optionTypes](#module_lib/optionTypes)
    * [~List](#module_lib/optionTypes..List) : <code>[OptionType](#module_lib/optionTypes..OptionType)</code>
    * [~Obj](#module_lib/optionTypes..Obj) : <code>[OptionType](#module_lib/optionTypes..OptionType)</code>
    * [~OptionType](#module_lib/optionTypes..OptionType) : <code>Object</code>

<a name="module_lib/optionTypes..List"></a>

### lib/optionTypes~List : <code>[OptionType](#module_lib/optionTypes..OptionType)</code>
Represents a list OptionType. Use this for actionOptions that require an array answer.

**Kind**: inner constant of <code>[lib/optionTypes](#module_lib/optionTypes)</code>  
**Example**  
```js
const { OptionTypes } = require('@wwselleck/raft')
class MySource {
  options() {
   return {
     myAction: {
       f: '_MyAction',
       optionTypes: {
         listOfData: OptionTypes.List
       }
     }
   }
  }
}
```
<a name="module_lib/optionTypes..Obj"></a>

### lib/optionTypes~Obj : <code>[OptionType](#module_lib/optionTypes..OptionType)</code>
Represents a list OptionType. Use this for actionOptions that require an array answer.

**Kind**: inner constant of <code>[lib/optionTypes](#module_lib/optionTypes)</code>  
**Example**  
```js
const { OptionTypes } = require('@wwselleck/raft')
class MySource {
  options() {
   return {
     myAction: {
       f: '_MyAction',
       optionTypes: {
         objectOfData: OptionTypes.Obj
       }
     }
   }
  }
}
```
<a name="module_lib/optionTypes..OptionType"></a>

### lib/optionTypes~OptionType : <code>Object</code>
**Kind**: inner typedef of <code>[lib/optionTypes](#module_lib/optionTypes)</code>  
<a name="module_lib/raft"></a>

## lib/raft
Main Raft module. This module is directly exported by the index module

**Access**: public  

* [lib/raft](#module_lib/raft)
    * _static_
        * [.create(config)](#module_lib/raft.create) ⇒ <code>[Raft](#module_lib/raft..Raft)</code>
    * _inner_
        * [~Raft](#module_lib/raft..Raft)
            * [new Raft(config)](#new_module_lib/raft..Raft_new)
            * [._applySources(sources)](#module_lib/raft..Raft+_applySources) ⇒ <code>void</code>
            * [.sources()](#module_lib/raft..Raft+sources) ⇒ <code>Object.&lt;string, module:lib/raft~SourceConfig&gt;</code>
            * [.use(id, sourceConfig)](#module_lib/raft..Raft+use)
            * [.get(id)](#module_lib/raft..Raft+get) ⇒ <code>[RaftDataSource](#module_lib/raftDataSource..RaftDataSource)</code>
            * [.fetch()](#module_lib/raft..Raft+fetch) ⇒ <code>Object</code>
        * [~RaftConfig](#module_lib/raft..RaftConfig) : <code>Object</code>
        * [~SourceConfig](#module_lib/raft..SourceConfig) : <code>Object</code>

<a name="module_lib/raft.create"></a>

### lib/raft.create(config) ⇒ <code>[Raft](#module_lib/raft..Raft)</code>
Creates an instance of Raft

**Kind**: static method of <code>[lib/raft](#module_lib/raft)</code>  

| Param | Type |
| --- | --- |
| config | <code>[RaftConfig](#module_lib/raft..RaftConfig)</code> | 

<a name="module_lib/raft..Raft"></a>

### lib/raft~Raft
Main Raft class.

**Kind**: inner class of <code>[lib/raft](#module_lib/raft)</code>  

* [~Raft](#module_lib/raft..Raft)
    * [new Raft(config)](#new_module_lib/raft..Raft_new)
    * [._applySources(sources)](#module_lib/raft..Raft+_applySources) ⇒ <code>void</code>
    * [.sources()](#module_lib/raft..Raft+sources) ⇒ <code>Object.&lt;string, module:lib/raft~SourceConfig&gt;</code>
    * [.use(id, sourceConfig)](#module_lib/raft..Raft+use)
    * [.get(id)](#module_lib/raft..Raft+get) ⇒ <code>[RaftDataSource](#module_lib/raftDataSource..RaftDataSource)</code>
    * [.fetch()](#module_lib/raft..Raft+fetch) ⇒ <code>Object</code>

<a name="new_module_lib/raft..Raft_new"></a>

#### new Raft(config)

| Param | Type |
| --- | --- |
| config | <code>[RaftConfig](#module_lib/raft..RaftConfig)</code> | 

<a name="module_lib/raft..Raft+_applySources"></a>

#### raft._applySources(sources) ⇒ <code>void</code>
**Kind**: instance method of <code>[Raft](#module_lib/raft..Raft)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sources | <code>Object.&lt;string, module:lib/raft~SourceConfig&gt;</code> | sources to apply |

<a name="module_lib/raft..Raft+sources"></a>

#### raft.sources() ⇒ <code>Object.&lt;string, module:lib/raft~SourceConfig&gt;</code>
Get active sources

**Kind**: instance method of <code>[Raft](#module_lib/raft..Raft)</code>  
<a name="module_lib/raft..Raft+use"></a>

#### raft.use(id, sourceConfig)
Use a source

**Kind**: instance method of <code>[Raft](#module_lib/raft..Raft)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | ID to identify source |
| sourceConfig | <code>lib/raft.SourceConfig</code> | Configuration |

<a name="module_lib/raft..Raft+get"></a>

#### raft.get(id) ⇒ <code>[RaftDataSource](#module_lib/raftDataSource..RaftDataSource)</code>
Get a source

**Kind**: instance method of <code>[Raft](#module_lib/raft..Raft)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of source to get |

<a name="module_lib/raft..Raft+fetch"></a>

#### raft.fetch() ⇒ <code>Object</code>
Get all default data from all sources

**Kind**: instance method of <code>[Raft](#module_lib/raft..Raft)</code>  
<a name="module_lib/raft..RaftConfig"></a>

### lib/raft~RaftConfig : <code>Object</code>
**Kind**: inner typedef of <code>[lib/raft](#module_lib/raft)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dataSources | <code>Object.&lt;string, module:lib/raft~SourceConfig&gt;</code> | Sources to apply |

<a name="module_lib/raft..SourceConfig"></a>

### lib/raft~SourceConfig : <code>Object</code>
**Kind**: inner typedef of <code>[lib/raft](#module_lib/raft)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| source | <code>Object</code> | Plugin |
| options | <code>Object</code> | Options for plugin |
| options.default | <code>Object</code> | Defaults to apply to source. For use with 'fetch' |
| options.default.action | <code>string</code> | Name of default action |
| options.default.options | <code>Object</code> | Options to give to default action |

<a name="module_lib/raftDataSource"></a>

## lib/raftDataSource

* [lib/raftDataSource](#module_lib/raftDataSource)
    * _static_
        * [.create(source, options)](#module_lib/raftDataSource.create) ⇒ <code>[RaftDataSource](#module_lib/raftDataSource..RaftDataSource)</code>
    * _inner_
        * [~RaftDataSource](#module_lib/raftDataSource..RaftDataSource)
            * [.do(actionName, actionOptions)](#module_lib/raftDataSource..RaftDataSource+do) ⇒ <code>Object</code>
            * [.options()](#module_lib/raftDataSource..RaftDataSource+options)

<a name="module_lib/raftDataSource.create"></a>

### lib/raftDataSource.create(source, options) ⇒ <code>[RaftDataSource](#module_lib/raftDataSource..RaftDataSource)</code>
Create an instance of RaftDataSource

**Kind**: static method of <code>[lib/raftDataSource](#module_lib/raftDataSource)</code>  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Object</code> | Source to wrap |
| options | <code>Object</code> | Options for data source |

<a name="module_lib/raftDataSource..RaftDataSource"></a>

### lib/raftDataSource~RaftDataSource
**Kind**: inner class of <code>[lib/raftDataSource](#module_lib/raftDataSource)</code>  