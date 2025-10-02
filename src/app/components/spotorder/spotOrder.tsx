"use client";

import React from "react";
import { useState } from "react";
import { Switch } from "antd";
import Button from "../shared/btn/btn";
import HeaderItem,  { type IChildrenItem} from "../header/item/Item";
import { DownOutlined } from "@ant-design/icons";
import './spotOrder.css'

export function SpotOrder() {
  const [activeTab, setActiveTab] = useState<"trade" | "tools">("trade");
  const [checked, setChecked] = useState(false);
  const placeType : IChildrenItem[] = [
    {
      label: "TP/SL",
      onClick: () => {},
    },
    {
      label: "Trailing stop",
      onClick: () => {},
    },
    {
      label: "Kích hoạt",
      onClick: () => {},
    },
    {
      label: "Giới hạn nâng cao",
      onClick: () => {},
    },
  ]
  return (
    <div className="spot-order">
        <div className="main-tabs">
            <div className="main-left">
                <div onClick={() => setActiveTab("trade")}>Giao dịch</div>
                <div onClick={() => setActiveTab("tools")}>Công cụ</div>
            </div>
            <div className="main-right">
                <span>Ký quỹ</span>
                <Switch checked={checked} onChange={setChecked} />
            </div>
        </div>

        <div className="place-btn">
            <Button size="medium" background="none">Mua</Button>
            <Button size="medium" background="none">Bán</Button>
        </div>

        {activeTab === "trade" && (
        <>
            <div className="child-tabs">
                <div className="coc-tabs">Giới hạn</div>
                <div className="coc-tabs">Thị trường</div>
                <div className="child-right">
                  <HeaderItem
                    label="TP/SL"
                    onClick={() => {}}
                    icon={<DownOutlined />}
                    childrens={placeType}
                />
                </div>
            </div>
        </>
        )}
    </div>
  );
}