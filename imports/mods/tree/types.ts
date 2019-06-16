import { NamedNode } from '../mods/types/named-node/NamedNode.meta';
import String = Match.String;

const Named: any = null;
const Template: any = null;
const GridLayout: any = null;
const StrategyManager: any = null;
const Comments: any = null;
const Types: any = null;
const Link: any = null;
const String: any = null;

/**
 * Experiments on abstract type system.
 * @type {{_id: string; _: string; duration: any; $: (any)[]}}
 */

const TaskType = {
    _id: 'some-id-DKfjsdkwrfvnNVa',
    _: 'NamedNode',
    duration: Date,

    $: [Named, String, Template('id'), GridLayout, StrategyManager]
};

const typeData = {
    _id: 'task-id-sdads',
    _: 'Type',
    p: ['some-parent-id'],
    duration: new Date(),
    $: [
        {
            _: 'Template',
            id: 'id-of-template',
            $: []
        },
        {
            _: 'Named',
            name: 'Task with duration',
        },
        {
            _: 'Comments',
            comments: [
                { text: 'First comment', date: new Date(),  }
            ]
        },
    ],
};



const type = Types.from(typeData);
