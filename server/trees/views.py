# Create your views here.
import logging
from rest_framework import status, exceptions
from rest_framework.generics import RetrieveAPIView, ListAPIView, GenericAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from server.trees.models import Tree
from server.trees.serializers import TreeSerializer

logger = logging.getLogger('custom')

class TreeView(RetrieveAPIView):
    queryset = Tree.objects.all()
    serializer_class = TreeSerializer
    permission_classes = (IsAuthenticated,)

class TreeDestroyView(DestroyAPIView):
    queryset = Tree.objects.all()
    serializer_class = TreeSerializer
    permission_classes = (IsAuthenticated,)

class TreeListView(ListAPIView):
    serializer_class = TreeSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Optionally restricts the returned trees by filtering against a `name` query parameter in the URL.
        """
        queryset = Tree.objects.all()
        name = self.request.query_params.get('name', None)
        if name is not None:
            queryset = queryset.filter(name=name)
        return queryset

class TreeCreateView(GenericAPIView):
    serializer_class = TreeSerializer
    permission_classes = (IsAuthenticated,)

    def save(self, request):
        try:
            tree = None
            _id = request.data.get('id')
            if _id:
                try:
                    tree = Tree.objects.get(id=request.data.get('id'))
                except Tree.DoesNotExist:
                    pass
            if not tree:
                serializer = self.get_serializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                serializer = self.get_serializer(data=request.data)
                if serializer.is_valid():
                    serializer.update(tree, request.data)
                    return Response(serializer.data, status=status.HTTP_200_OK)
            raise exceptions.ValidationError('tree serializer not valid')
        except Exception as e:
            logger.error('save tree data error')
            logger.exception(e)
            return Response({"message": "unexpected error: %s" % str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        return self.save(request)