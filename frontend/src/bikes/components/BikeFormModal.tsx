import { Col, Input, InputNumber, Modal, Row, Switch, Typography } from "antd";
import { useState } from "react";
import type { BikeModel, CreateBikeModel } from "../models/BikeModel";

interface BikeFormModalProps {
  title: string;
  okText: string;
  bike?: BikeModel;
  onClose: () => void;
  onSubmit: (input: CreateBikeModel) => Promise<void>;
}

type TextField =
  "brand" | "model" | "description" | "category" | "frameMaterial";

type NumberField =
  "frameSizeCm" | "wheelSizeInches" | "gearCount" | "weightKg" | "price";

type BikeFormValues = Record<TextField, string> &
  Record<NumberField, number | null> & { electric: boolean };

type BikeFormErrors = Partial<Record<TextField | NumberField, string>>;

const toValues = (bike?: BikeModel): BikeFormValues => ({
  brand: bike?.brand ?? "",
  model: bike?.model ?? "",
  description: bike?.description ?? "",
  category: bike?.category ?? "",
  frameMaterial: bike?.frameMaterial ?? "",
  frameSizeCm: bike?.frameSizeCm ?? null,
  wheelSizeInches: bike?.wheelSizeInches ?? null,
  gearCount: bike?.gearCount ?? null,
  weightKg: bike?.weightKg ?? null,
  price: bike ? bike.priceCents / 100 : null,
  electric: bike?.electric ?? false,
});

const validate = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};
  if (!values.brand.trim()) errors.brand = "Brand is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.description.trim())
    errors.description = "Description is required";
  if (!values.category.trim()) errors.category = "Category is required";
  if (!values.frameMaterial.trim())
    errors.frameMaterial = "Frame material is required";
  if (!values.frameSizeCm) errors.frameSizeCm = "Must be greater than 0";
  if (!values.wheelSizeInches)
    errors.wheelSizeInches = "Must be greater than 0";
  if (!values.gearCount) errors.gearCount = "Must be at least 1";
  if (!values.weightKg) errors.weightKg = "Must be greater than 0";
  if (values.price === null) errors.price = "Price is required";
  return errors;
};

const toCreateBikeModel = (values: BikeFormValues): CreateBikeModel => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  description: values.description.trim(),
  category: values.category.trim(),
  frameMaterial: values.frameMaterial.trim(),
  frameSizeCm: values.frameSizeCm ?? 0,
  wheelSizeInches: values.wheelSizeInches ?? 0,
  gearCount: values.gearCount ?? 0,
  weightKg: values.weightKg ?? 0,
  electric: values.electric,
  priceCents: Math.round((values.price ?? 0) * 100),
});

export const BikeFormModal = ({
  title,
  okText,
  bike,
  onClose,
  onSubmit,
}: BikeFormModalProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues>(toValues(bike));
  const [errors, setErrors] = useState<BikeFormErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const onConfirm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    setSaveError(null);
    onSubmit(toCreateBikeModel(values))
      .then(onClose)
      .catch(() => setSaveError("The bike could not be saved"))
      .finally(() => setIsSaving(false));
  };

  const errorText = (name: TextField | NumberField) =>
    errors[name] && (
      <Typography.Text type="danger">{errors[name]}</Typography.Text>
    );

  const textField = (name: TextField, label: string) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <Input
        id={`bike-${name}`}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(event) => {
          setValues({ ...values, [name]: event.target.value });
          setErrors({ ...errors, [name]: undefined });
        }}
      />
      {errorText(name)}
    </>
  );

  const numberField = (
    name: NumberField,
    label: string,
    min: number,
    precision?: number,
  ) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <InputNumber
        id={`bike-${name}`}
        style={{ width: "100%" }}
        min={min}
        precision={precision}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(value) => {
          setValues({ ...values, [name]: value });
          setErrors({ ...errors, [name]: undefined });
        }}
      />
      {errorText(name)}
    </>
  );

  return (
    <Modal
      open
      title={title}
      okText={okText}
      onCancel={onClose}
      onOk={onConfirm}
      confirmLoading={isSaving}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>{textField("brand", "Brand *")}</Col>
        <Col span={12}>{textField("model", "Model *")}</Col>
        <Col span={24}>{textField("description", "Description *")}</Col>
        <Col span={12}>{textField("category", "Category *")}</Col>
        <Col span={12}>{textField("frameMaterial", "Frame material *")}</Col>
        <Col span={12}>
          {numberField("frameSizeCm", "Frame size (cm) *", 0)}
        </Col>
        <Col span={12}>
          {numberField("wheelSizeInches", "Wheel size (inches) *", 0)}
        </Col>
        <Col span={12}>{numberField("gearCount", "Gears *", 1, 0)}</Col>
        <Col span={12}>{numberField("weightKg", "Weight (kg) *", 0)}</Col>
        <Col span={12}>{numberField("price", "Price (€) *", 0, 2)}</Col>
        <Col span={12}>
          <label htmlFor="bike-electric">Electric</label>
          <div>
            <Switch
              id="bike-electric"
              checked={values.electric}
              onChange={(electric) => setValues({ ...values, electric })}
            />
          </div>
        </Col>
        {saveError && (
          <Col span={24}>
            <Typography.Text type="danger">{saveError}</Typography.Text>
          </Col>
        )}
      </Row>
    </Modal>
  );
};
