// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers';
import { KnexService } from '@feathersjs/knex';
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex';

import type { Application } from '../../declarations';
import type { Todo, TodoData, TodoPatch, TodoQuery } from './todo.schema';

export type { Todo, TodoData, TodoPatch, TodoQuery };

export interface TodoParams extends KnexAdapterParams<TodoQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class TodoService<ServiceParams extends Params = TodoParams> extends KnexService<
    Todo,
    TodoData,
    TodoParams,
    TodoPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('sqliteClient'),
        name: 'todo',
    };
};
