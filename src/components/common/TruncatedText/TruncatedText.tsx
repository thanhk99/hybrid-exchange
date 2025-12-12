import React, { useState } from 'react';
import { Tooltip, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface TruncatedTextProps {
    text: string;
    startLength?: number;
    endLength?: number;
    copyable?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
    text,
    startLength = 6,
    endLength = 4,
    copyable = true,
    className,
    style,
}) => {
    const [copied, setCopied] = useState(false);

    if (!text) return null;

    const shouldTruncate = text.length > startLength + endLength;
    const truncatedText = shouldTruncate
        ? `${text.slice(0, startLength)}...${text.slice(-endLength)}`
        : text;

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        message.success('Đã sao chép');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <span
            className={className}
            style={{
                cursor: copyable ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                ...style
            }}
            onClick={copyable ? handleCopy : undefined}
        >
            <Tooltip title={copyable ? "Nhấn để sao chép" : text}>
                <span>{truncatedText}</span>
            </Tooltip>
            {copyable && (
                <CopyOutlined
                    style={{
                        fontSize: '12px',
                        color: copied ? '#52c41a' : '#8c8c8c',
                        transition: 'color 0.3s'
                    }}
                />
            )}
        </span>
    );
};

export default TruncatedText;
