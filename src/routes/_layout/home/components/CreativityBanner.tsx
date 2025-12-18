import {Card} from "antd";

const CreativityBanner = () => {

  return (
    <Card
      className="h-full flex-col-stretch card-wrapper"
      size="small"
      styles={{ body: { flex: 1, overflow: 'hidden' } }}
      title='创意'
      variant="borderless"
    >
      <div className="h-full flex-center">
        <IconLocalBanner className="text-400px text-primary sm:text-320px" />
      </div>
    </Card>
  );
};

export default CreativityBanner;
