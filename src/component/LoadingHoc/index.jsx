import React from 'react';
import { Spin } from 'antd';

export function LoadingHoc(Component) {
    return class LoadingHoc extends React.Component {
        state = {
            loading: false
        };

        toggleLoading = () => {
            const mounted = this.updater.isMounted(this);
            if (mounted) {
                this.setState(prevState => ({
                    loading: !prevState.loading
                }));
            }
        };

        render() {
            return (
                <Spin spinning={this.state.loading}>
                    <Component
                        toggleLoading={this.toggleLoading}
                        {...this.props}
                    />
                </Spin>
            );
        }
    };
}
