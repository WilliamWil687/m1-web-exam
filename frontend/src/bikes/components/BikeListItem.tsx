import {
  EyeOutlined,
  ShoppingOutlined,
  TagOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Col, Row, Space } from "antd";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { ListItem } from "../../shared/components/ListItem";
import { formatPrice } from "../../shared/utils/formatPrice";
import type { BikeModel } from "../models/BikeModel";
import { DeleteBikeButton } from "./DeleteBikeButton";

interface BikeListItemProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}

export const BikeListItem = ({ bike, deleteBike }: BikeListItemProps) => {
  return (
    <ListItem>
      <Col span={10}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <ShoppingOutlined />
          {`${bike.brand} ${bike.model}`}
          {bike.electric && <ThunderboltOutlined aria-label="Electric" />}
        </Space>
      </Col>
      <Col span={8}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <TagOutlined />
          {bike.category}
        </Space>
      </Col>
      <Col span={4}>{formatPrice(bike.priceCents)}</Col>
      <Col span={2}>
        <Row gutter={[4, 4]}>
          <Col>
            <ButtonLink to={`/bikes/$bikeId`} params={{ bikeId: bike.id }}>
              <EyeOutlined />
            </ButtonLink>
          </Col>
          <Col>
            <DeleteBikeButton bike={bike} deleteBike={deleteBike} />
          </Col>
        </Row>
      </Col>
    </ListItem>
  );
};
