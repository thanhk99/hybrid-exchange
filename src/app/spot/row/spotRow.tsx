import React from "react";

interface SpotRowProps {
    symbol : string;
    price : number;
    changePercent : number;
    low24h : number;
    high24h : number;
    volume : number;
    onClick : ()=> void;
    className? : string;
    operation? : React.ReactNode; // thao tác
}

const SpotRow: React.FC<SpotRowProps> = React.memo(({
    symbol,
    price,
    changePercent,
    low24h,
    high24h,
    volume,
    onClick,
    operation
}) => {
    return (
        <tr
            onClick={() => onClick()}
            className=""
        >
            <td className="">{symbol}</td>
            <td className="">${price.toLocaleString()}</td>
            <td
                className={` ${
                    changePercent < 0 ? "text-red-500" : "text-green-500"
                }`}
            >
                {changePercent}%
            </td>
            <td className="">${low24h}</td>
            <td className="">${high24h}</td>
            <td className="">{volume}</td>
            <td className="">{operation}</td>
        </tr>
    );
});

SpotRow.displayName = "SpotRow";

export default SpotRow;