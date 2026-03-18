import { Link } from 'react-router-dom';
import { type PriceRequest } from '../../domain/entities/Request';
import { formatRelativeTime } from '../../shared/utils/formatDate';
import { getCategoryInfo } from '../../domain/constants/categories';
import { getCityInfo } from '../../domain/constants/cities';

interface Props {
  request: PriceRequest;
}

const statusLabels: Record<string, { zh: string; en: string; cls: string }> = {
  waiting: { zh: '待回覆', en: 'Waiting', cls: 'status-waiting' },
  answered: { zh: '已回覆', en: 'Answered', cls: 'status-answered' },
  closed: { zh: '已關閉', en: 'Closed', cls: 'status-closed' },
};

export function RequestCard({ request }: Props) {
  const category = getCategoryInfo(request.category);
  const city = getCityInfo(request.city);
  const status = statusLabels[request.status];

  return (
    <Link to={`/request/${request.id}`} className="block">
      <div className="card p-4 hover:shadow-md transition-shadow duration-200 active:scale-[0.99]">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {request.avatarEmoji && request.avatarEmoji.startsWith('http') ? (
              <img src={request.avatarEmoji} alt="avatar" className="w-7 h-7 rounded-full flex-shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-base flex-shrink-0">
                {request.avatarEmoji || '👤'}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-sm font-medium text-gray-700 truncate block">{request.username}</span>
              <span className="text-xs text-gray-400">{formatRelativeTime(request.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {request.urgency === 'urgent' && (
              <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                ⚡ 急需
              </span>
            )}
            <span className={status.cls}>{status.zh}</span>
          </div>
        </div>

        {/* Product */}
        <div className="mb-3">
          <h3 className="font-bold text-charcoal text-base leading-tight mb-0.5">
            {request.productName}
            {request.brand && <span className="font-normal text-gray-500 text-sm"> · {request.brand}</span>}
          </h3>
          {request.description && (
            <p className="text-sm text-gray-500 line-clamp-1">{request.description}</p>
          )}
        </div>

        {/* Store & location */}
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <span>🏪</span>
            <span className="font-medium">{request.storeName}</span>
          </span>
          <span className="text-gray-300">·</span>
          <span>
            {city?.flag ?? ''} {city?.labelZh ?? request.city}
            {request.district && ` · ${request.district}`}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
            {category.emoji} {category.labelZh}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {request.tipEnabled && (
              <span className="text-accent-500 font-medium">💰 贈NT$10</span>
            )}
            <span className="flex items-center gap-1">
              <span>💬</span>
              <span>{request.responseCount}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
