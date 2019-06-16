import * as React from 'react';
export interface IGlobalFooterProps {
  copyright?: React.ReactNode;
  style?: React.CSSProperties;
}

export default class GlobalFooter extends React.Component<IGlobalFooterProps, any> {}
