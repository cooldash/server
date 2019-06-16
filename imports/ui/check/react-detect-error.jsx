import React from 'react';
import { Button } from 'antd';
import { Meta, addComponent } from '../../tree';
import { createAddMeta } from '../../tree/ui/addmeta/create';
import MetaEdit from '../../mods/types/MetaEdit';

const TestErrorMeta = Meta.inherit({
  name: 'test.error',
  fields: {
    error: String,
  },
});

const TestErrorComponent = ({ meta }) => {
  throw new Error(meta.error);
  return (
    <Button onClick={() => { throw new Error(meta.error); }}>Throw error</Button>
  );
};

addComponent(TestErrorComponent, TestErrorMeta, 'react');
addComponent(MetaEdit, TestErrorMeta, 'react edit');
createAddMeta(TestErrorMeta, 'test/ui', 'UI Error', meta => meta.set({ error: 'Test Error' }));
