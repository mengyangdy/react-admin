import {Card, Col, Row} from 'antd'

interface CardDataProps{
  color:{
    end:string
    start:string
  }
  icon:string
  key:string
  title:string
  unit:string
  value:number
}

function getGradientColor(color:CardDataProps['color']){
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}

function useGetCardData(){
  const cardData:CardDataProps[]=[
  {
    color: {
      end: '#b955a4',
        start: '#ec4786'
    },
    icon: 'ant-design:bar-chart-outlined',
      key: 'visitCount',
    title: '访问量',
    unit: '',
    value: 9725
  },
  {
    color: {
      end: '#5144b4',
        start: '#865ec0'
    },
    icon: 'ant-design:money-collect-outlined',
      key: 'turnover',
    title: '成交额',
    unit: '$',
    value: 1026
  },
  {
    color: {
      end: '#719de3',
        start: '#56cdf3'
    },
    icon: 'carbon:document-download',
      key: 'downloadCount',
    title: '下载量',
    unit: '',
    value: 970925
  },
  {
    color: {
      end: '#f68057',
        start: '#fcbc25'
    },
    icon: 'ant-design:trademark-circle-outlined',
      key: 'dealCount',
    title: '成交量',
    unit: '',
    value: 9527
  }
  ]
  return cardData
}

const CardItem=(data:CardDataProps)=>{
  return (
    <Col key={data.key} lg={6} md={12} span={24}>
      <div className='flex-1 rd-8px px-16px pb-4px pt-8px text-white' style={{
        backgroundImage:getGradientColor(data.color)
      }}>
        <h3 className='text-16px'>{data.title}</h3>
        <div className='flex justify-between pt-12px'>
          <SvgIcon className='text-32px' icon={data.icon} />
          <NumberTicker className='text-30px' prefix={data.unit} value={data.value} />
        </div>
      </div>
    </Col>
  )
}

const CardData=()=>{
  const data=useGetCardData()

  return (
    <Card className='card-wrapper' size='small' variant='borderless'>
      <Row gutter={[16,16]}>
        {data.map(CardItem)}
      </Row>
    </Card>

  )
}

export default CardData